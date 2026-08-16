import type { Application } from "../types/application";

interface ApplicationTableProps {
  applications: Application[];
  onEdit: (application: Application) => void;
  onDelete: (id: number) => void;
}

function ApplicationTable({
  applications,
  onEdit,
  onDelete,
}: ApplicationTableProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="w-full text-left">

          <thead className="border-b bg-slate-50">
            <tr>

              <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                Application
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                Owner Team
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                Environment
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                Status
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                Base URL
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">
  Actions
</th>

            </tr>
          </thead>

          <tbody className="divide-y">

            {applications.map((application) => (

              <tr
                key={application.id}
                className="hover:bg-slate-50"
              >

                <td className="px-6 py-4">

                  <div className="font-medium text-slate-900">
                    {application.applicationName}
                  </div>

                  <div className="text-sm text-slate-400">
                    ID: {application.id}
                  </div>

                </td>

                <td className="px-6 py-4 text-sm text-slate-600">
                  {application.ownerTeam}
                </td>

                <td className="px-6 py-4">

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {application.environment}
                  </span>

                </td>

                <td className="px-6 py-4">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      application.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {application.status}
                  </span>

                </td>

                <td className="px-6 py-4 text-sm text-slate-500">
                  {application.baseUrl}
                </td>
                <td className="px-6 py-4">

  <div className="flex gap-2">

    <button
      type="button"
      onClick={() => onEdit(application)}
      className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
    >
      Edit
    </button>

    <button
      type="button"
      onClick={() => onDelete(application.id)}
      className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100"
    >
      Delete
    </button>

  </div>

</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ApplicationTable;