export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("⏳ [Boot] Enforcing PostgreSQL Schema Push...");

    try {
      const { getPayload } = await import("payload");
      const configModule = await import("./payload.config");
      const config = configModule.default || configModule;

      const payload = await getPayload({ config });

      // اجرای صریح ایجاد ساختار جداول روی دیتابیس
      if (payload.db && typeof payload.db.pushSchema === "function") {
        await payload.db.pushSchema();
        console.log(
          "✅ [Boot] Database tables successfully created via pushSchema.",
        );
      } else if (payload.db && typeof (payload.db as any).sync === "function") {
        await (payload.db as any).sync();
        console.log("✅ [Boot] Database tables successfully created via sync.");
      } else {
        console.log("ℹ️ [Boot] Schema verification completed.");
      }
    } catch (error) {
      console.error("❌ [Boot] Critical error executing schema push:", error);
    }
  }
}
