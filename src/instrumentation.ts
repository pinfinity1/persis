export async function register() {
  // این کد فقط در محیط سرور و دقیقاً در ثانیه صفر بوت شدن کانتینر اجرا می‌شود
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("⏳ [Boot] Synchronizing Payload CMS and Database Schema...");

    try {
      const { getPayload } = await import("payload");
      const configModule = await import("./payload.config");

      // این متد اجرا می‌شود و به دلیل داشتن await، تا زمانی که
      // قابلیت push: true تمام جدول‌ها را در Postgres نسازد،
      // اجازه استارت شدن سایت و رندر صفحات را به Next.js نمی‌دهد.
      await getPayload({ config: configModule.default || configModule });

      console.log("✅ [Boot] Database schema is fully synced and ready.");
    } catch (error) {
      console.error("❌ [Boot] Critical error during database sync:", error);
    }
  }
}
