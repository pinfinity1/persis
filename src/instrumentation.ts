export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("⏳ [Boot] Initializing Payload DB Adapter & Schema...");

    try {
      const { getPayload } = await import("payload");
      const configModule = await import("./payload.config");
      const config = configModule.default || configModule;

      const payload = await getPayload({ config });

      // فراخوانی متد داخلی آداپتر پستگرس جهت اطمینان از همگام‌سازی جداول
      const dbAdapter = payload.db as unknown as {
        init?: () => Promise<void>;
        connect?: () => Promise<void>;
      };

      if (typeof dbAdapter.init === "function") {
        await dbAdapter.init();
      }

      console.log("✅ [Boot] Payload DB Adapter is initialized and ready.");
    } catch (error) {
      console.error("❌ [Boot] Database init error:", error);
    }
  }
}
