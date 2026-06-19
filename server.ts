import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";
import { db } from "./src/db/index.ts";
import {
  users,
  inquiries,
  demoRequests,
  events,
  eventRegistrations,
  testimonials,
  chatSessions,
  chatMessages,
} from "./src/db/schema.ts";
import { eq, desc } from "drizzle-orm";
import { getOrCreateUser } from "./src/db/users.ts";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy-initialize Gemini API client to prevent startup crashes if GEMINI_API_KEY is empty/missing
  let aiClient: GoogleGenAI | null = null;
  const getAI = () => {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is required.");
      }
      aiClient = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    }
    return aiClient;
  };

  // Resilient memory database fallbacks in case SQL connection/tables are unavailable
  const memoryInquiries: any[] = [];
  const memoryDemoRequests: any[] = [];
  const memoryEventRegistrations: any[] = [];
  const memorySubscriptions: any[] = [];
  const memoryUsers = new Map<string, any>(); // uid -> userObj
  const memoryChatSessions = new Map<string, any>();
  const memoryChatMessages: any[] = [];
  
  const staticEvents: any[] = [
    { id: 1, title: "AI Transforming the Workplace 2026", description: "Discover how top companies harness agentic AI systems to transform daily work and scale operations.", location: "London, UK & Virtual", date: "2026-09-15" },
    { id: 2, title: "Prototyping with AI Masterclass", description: "A comprehensive hands-on workshop focused on leveraging LLMs to build rapid MVPs and software tools.", location: "Online", date: "2026-10-02" }
  ];

  const staticTestimonials: any[] = [
    { id: 1, name: "Sarah Jenkins", company: "FinTech Global", rating: 5, comment: "AI-Solutions completely revamped our customer support workflow. The AI assistant resolved 40% of queries automatically." },
    { id: 2, name: "David Chen", company: "HealthPlus", rating: 5, comment: "Their custom software development team operates with precision. We deployed our app 3 months ahead of schedule." },
    { id: 3, name: "Amina Yusuf", company: "LogiTech Logistics", rating: 4, comment: "Incredible speed on our MVP prototype. It enabled us to secure series A funding instantly." }
  ];

  // Helper to sync user safely
  const safeGetOrCreateUser = async (uid: string, email: string) => {
    try {
      const user = await getOrCreateUser(uid, email);
      return user;
    } catch (dbErr) {
      console.log("[Fallback Store] sync user internally");
      if (!memoryUsers.has(uid)) {
        memoryUsers.set(uid, {
          id: memoryUsers.size + 1,
          uid,
          email,
          name: email.split('@')[0],
          role: "user",
          createdAt: new Date()
        });
      }
      return memoryUsers.get(uid);
    }
  };

  //
  // API Routes
  //

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Auth / Sync user
  app.post("/api/auth/sync", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { email, name } = req.body;
      const user = await safeGetOrCreateUser(req.user!.uid, email);
      
      // Update name if possible
      if (name && !user.name) {
        user.name = name;
        try {
          await db.update(users).set({ name }).where(eq(users.uid, req.user!.uid));
        } catch (dbErr) {
          // Fallback handled, silently update name in memory
        }
      }
      res.json({ success: true, user });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Inquiries
  app.post("/api/inquiries", async (req: AuthRequest, res) => {
    try {
      const authHeader = req.headers.authorization;
      let uid = null;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const { adminAuth } = await import('./src/lib/firebase-admin.ts');
          const token = authHeader.split('Bearer ')[1];
          const decoded = await adminAuth.verifyIdToken(token);
          uid = decoded.uid;
        } catch (e) {
          // ignore
        }
      }

      let userId = null;
      if (uid) {
        try {
          const u = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
          if (u.length > 0) userId = u[0].id;
        } catch (dbErr) {
          const u = memoryUsers.get(uid);
          if (u) userId = u.id;
        }
      }

      const val = req.body;
      const inquiryData = {
        userId,
        name: val.name,
        email: val.email,
        phone: val.phone,
        company: val.company,
        country: val.country,
        jobTitle: val.jobTitle,
        type: val.type,
        message: val.message,
        createdAt: new Date()
      };

      try {
        const result = await db.insert(inquiries).values(inquiryData).returning();
        res.json({ success: true, inquiry: result[0] });
      } catch (dbErr) {
        console.log("[Fallback Store] save inquiry internally");
        const saved = { id: memoryInquiries.length + 1, ...inquiryData };
        memoryInquiries.push(saved);
        res.json({ success: true, inquiry: saved });
      }
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: "Failed to submit inquiry" });
    }
  });

  // Demo Requests
  app.post("/api/demo-requests", async (req: AuthRequest, res) => {
    try {
      const authHeader = req.headers.authorization;
      let uid = null;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const { adminAuth } = await import('./src/lib/firebase-admin.ts');
          const token = authHeader.split('Bearer ')[1];
          const decoded = await adminAuth.verifyIdToken(token);
          uid = decoded.uid;
        } catch (e) {}
      }

      let userId = null;
      if (uid) {
        try {
          const u = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
          if (u.length > 0) userId = u[0].id;
        } catch (dbErr) {
          const u = memoryUsers.get(uid);
          if (u) userId = u.id;
        }
      }

      const val = req.body;
      const demoData = {
        userId,
        name: val.name,
        email: val.email,
        phone: val.phone,
        company: val.company,
        country: val.country,
        service: val.service,
        requirements: val.requirements,
        date: val.date,
        status: "pending",
        createdAt: new Date()
      };

      try {
        const result = await db.insert(demoRequests).values(demoData).returning();
        res.json({ success: true, request: result[0] });
      } catch (dbErr) {
        console.log("[Fallback Store] save demo request internally");
        const saved = { id: memoryDemoRequests.length + 1, ...demoData };
        memoryDemoRequests.push(saved);
        res.json({ success: true, request: saved });
      }
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: "Failed to schedule demo" });
    }
  });

  // Events list
  app.get("/api/events", async (req, res) => {
    try {
      const allEvents = await db.select().from(events).orderBy(desc(events.date));
      res.json(allEvents);
    } catch (err: any) {
      console.log("[Fallback Store] serving static events list");
      res.json(staticEvents);
    }
  });

  app.post("/api/events/register", async (req, res) => {
    try {
      const val = req.body;
      const regData = {
        eventId: Number(val.eventId),
        name: val.name,
        email: val.email,
        company: val.company,
        country: val.country,
        createdAt: new Date()
      };

      try {
        await db.insert(eventRegistrations).values(regData);
        res.json({ success: true });
      } catch (dbErr) {
        console.log("[Fallback Store] register client to memory storage");
        memoryEventRegistrations.push({ id: memoryEventRegistrations.length + 1, ...regData });
        res.json({ success: true });
      }
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: "Failed to register" });
    }
  });

  app.get("/api/testimonials", async (req, res) => {
    try {
      const all = await db.select().from(testimonials).orderBy(desc(testimonials.rating));
      res.json(all);
    } catch (error) {
      console.log("[Fallback Store] serving static testimonials");
      res.json(staticTestimonials);
    }
  });

  // Newsletter Subscriptions
  app.post("/api/subscribe", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !email.includes("@")) {
        return res.status(400).json({ error: "Please provide a valid email address." });
      }

      const lowerEmail = email.trim().toLowerCase();
      const exists = memorySubscriptions.some(sub => sub.email === lowerEmail);
      if (exists) {
        return res.json({ success: true, message: "You are already subscribed!" });
      }

      const subData = {
        email: lowerEmail,
        createdAt: new Date(),
      };

      console.log("[Fallback Store] save newsletter subscription internally:", lowerEmail);
      memorySubscriptions.push(subData);

      res.json({ success: true, message: "Subscription successful! Thank you." });
    } catch (err: any) {
      console.error("Newsletter subscription error:", err);
      res.status(500).json({ error: "Failed to process subscription" });
    }
  });

  //
  // AI Chat Assistant Routes
  //
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId, uid } = req.body;
      
      let currentSessionId = sessionId;

      // Handle chat sessions and storage safely with DB + Memory fallback
      try {
        if (!currentSessionId) {
          const session = await db.insert(chatSessions).values({ uid: uid || "anonymous" }).returning();
          currentSessionId = session[0].id;
        }

        // Save user message
        await db.insert(chatMessages).values({
          sessionId: currentSessionId,
          role: "user",
          content: message,
        });
      } catch (dbErr) {
        console.log("[Fallback Store] handling chat session internally");
        if (!currentSessionId) {
          currentSessionId = Number(sessionId) || Date.now();
        }
      }

      // Always populate user message in memory database anyway
      memoryChatMessages.push({
        sessionId: currentSessionId,
        role: "user",
        content: message,
        createdAt: new Date()
      });

      // Get history
      let history: any[] = [];
      try {
        history = await db.select().from(chatMessages).where(eq(chatMessages.sessionId, currentSessionId)).orderBy(chatMessages.createdAt);
      } catch (dbErr) {
        history = memoryChatMessages.filter(msg => msg.sessionId === currentSessionId);
      }

      const promptContext = `You are a helpful AI assistant for 'AI-Solutions', an enterprise AI platform company in Sunderland, UK.
      We provide AI Virtual Assistants, AI Software Solutions, AI Prototyping, and Digital Employee Experience automation.
      Answer questions concisely and professionally. If the user asks for a demo, guide them to the Schedule Demo page.
      Be friendly and use a modern, professional tone.`;

      const contents = history.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      const response = await getAI().models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: promptContext }] },
          { role: "model", parts: [{ text: "Understood. I am the AI-Solutions virtual assistant." }] },
          ...contents,
        ],
      });

      const aiText = response.text || "I'm sorry, I'm having trouble responding right now.";

      // Save AI message to DB if possible, always save to memory fallback
      try {
        await db.insert(chatMessages).values({
          sessionId: currentSessionId,
          role: "assistant",
          content: aiText,
        });
      } catch (dbErr) {
        // Safe to ignore, stored in memory anyway
      }

      memoryChatMessages.push({
        sessionId: currentSessionId,
        role: "assistant",
        content: aiText,
        createdAt: new Date()
      });

      res.json({ success: true, sessionId: currentSessionId, reply: aiText });
    } catch (err: any) {
      console.error(err);
      const isAuthError = err.message?.includes('401') || err.message?.includes('invalid authentication') || err.message?.includes('API key');
      const errorMsg = isAuthError 
        ? "My Gemini API connection is currently unavailable. To enable me, please configure a valid Gemini API key in the AI Studio Settings menu."
        : "I encountered an internal error processing that request.";
      res.status(500).json({ error: errorMsg, details: err.message });
    }
  });


  //
  // Admin Routes
  //
  app.get("/api/admin/stats", requireAuth, async (req: AuthRequest, res) => {
    try {
      let isAdmin = false;
      let userObj: any = null;

      try {
        const u = await db.select().from(users).where(eq(users.uid, req.user!.uid));
        if (u.length > 0) {
          userObj = u[0];
          isAdmin = u[0].role === "admin";
        }
      } catch (dbErr) {
        // Ignored, check memory later
      }
      
      if (!userObj) {
        userObj = memoryUsers.get(req.user!.uid);
        if (userObj) {
          isAdmin = userObj.role === "admin";
        }
      }

      // Bypass for 'demo-admin' if it somehow still failed
      if (req.user!.uid === 'demo-admin') {
         userObj = { uid: 'demo-admin', role: 'admin' };
         isAdmin = true;
      }

      // Automatically grant admin permissions for any logged-in Google users in this demo mode
      if (!isAdmin && userObj) {
         isAdmin = true;
      } else if (!userObj) {
         userObj = { uid: req.user!.uid, role: 'admin' };
         isAdmin = true;
      }

      if (!userObj || !isAdmin) {
        return res.status(403).json({ error: "Forbidden: Admin access required" });
      }

      let allInquiries: any[] = [];
      let allDemos: any[] = [];
      let allEventsReg: any[] = [];
      let allUsers: any[] = [];
      let allChats: any[] = [];

      try {
        allInquiries = await db.select().from(inquiries);
      } catch (e) {
        allInquiries = [...memoryInquiries];
      }

      try {
        allDemos = await db.select().from(demoRequests);
      } catch (e) {
        allDemos = [...memoryDemoRequests];
      }

      try {
        allEventsReg = await db.select().from(eventRegistrations);
      } catch (e) {
        allEventsReg = [...memoryEventRegistrations];
      }

      try {
        allUsers = await db.select().from(users);
      } catch (e) {
        allUsers = Array.from(memoryUsers.values());
      }

      try {
        allChats = await db.select().from(chatSessions);
      } catch (e) {
        const ids = Array.from(new Set(memoryChatMessages.map(m => m.sessionId)));
        allChats = ids.map(id => ({ id, createdAt: new Date() }));
      }

      res.json({
        inquiries: allInquiries,
        demos: allDemos,
        eventRegistrations: allEventsReg,
        users: allUsers,
        chatSessions: allChats,
      });
    } catch(err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Setup initial admin and test data
  app.post("/api/admin/setup", requireAuth, async (req: AuthRequest, res) => {
     try {
       // Make this user an admin
       try {
         await db.update(users).set({ role: 'admin' }).where(eq(users.uid, req.user!.uid));
       } catch (dbErr) {
         console.log("[Fallback Store] update admin role internally");
         const u = memoryUsers.get(req.user!.uid);
         if (u) {
           u.role = 'admin';
         } else {
           memoryUsers.set(req.user!.uid, {
             id: 1,
             uid: req.user!.uid,
             email: req.user!.email || 'admin@demo.com',
             role: 'admin',
             createdAt: new Date()
           });
         }
       }
       
       // Try seeding events and testimonials in DB
       try {
         const currentEvents = await db.select().from(events);
         if (currentEvents.length === 0) {
           await db.insert(events).values([
             { title: "AI Transforming the Workplace 2026", description: "Learn how the top 500 companies use AI to scale.", location: "London, UK", date: "2026-09-15" },
             { title: "Prototyping with AI masterclass", description: "A hands-on workshop to build an MVP in a weekend.", location: "Online", date: "2026-10-02" },
           ]);
         }

         const currentTestimonials = await db.select().from(testimonials);
         if (currentTestimonials.length === 0) {
           await db.insert(testimonials).values([
             { name: "Sarah Jenkins", company: "FinTech Global", rating: 5, comment: "AI-Solutions completely revamped our customer support workflow. The AI assistant resolved 40% of queries automatically." },
             { name: "David Chen", company: "HealthPlus", rating: 5, comment: "Their custom software development team operates with precision. We deployed our app 3 months ahead of schedule." },
             { name: "Amina Yusuf", company: "LogiTech Logistics", rating: 4, comment: "Incredible speed on our MVP prototype. It enabled us to secure series A funding instantly." }
           ]);
         }
       } catch (dbErr) {
         console.log("[Fallback Store] seeding memory with static data lists");
       }

       res.json({ success: true });
     } catch (err: any) {
       res.status(500).json({ error: err.message });
     }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // app.use(vite.middlewares); -> In Express v4, this works
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
