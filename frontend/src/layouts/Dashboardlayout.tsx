import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50">

      <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">
            PulseWatch
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            API Monitoring
          </p>
        </div>

        <nav className="px-4">
          <div className="rounded-lg bg-slate-800 px-4 py-3">
            Dashboard
          </div>

          <div className="mt-2 rounded-lg px-4 py-3 text-slate-300">
            Applications
          </div>

          <div className="mt-2 rounded-lg px-4 py-3 text-slate-300">
            Metrics
          </div>

          <div className="mt-2 rounded-lg px-4 py-3 text-slate-300">
            Analytics
          </div>
        </nav>
      </aside>

      <main className="ml-64 min-h-screen">
        <header className="border-b bg-white px-8 py-5">
          <h2 className="text-xl font-semibold text-slate-800">
            Dashboard
          </h2>
        </header>

        <section className="p-8">
          <Outlet />
        </section>
      </main>

    </div>
  );
}

export default DashboardLayout;