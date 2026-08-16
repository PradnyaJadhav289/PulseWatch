import { useEffect, useState } from "react";

import { getApplications } from "../services/applicationService";

import type { Application } from "../types/application";

import ApplicationTable from "../components/ApplicationTable";
import CreateApplicationForm from "../components/CreateApplicationForm";

function Applications() {

  const [applications, setApplications] =
    useState<Application[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);
 
    const [search, setSearch] = useState("");

const [environmentFilter, setEnvironmentFilter] =
  useState("ALL");

const [statusFilter, setStatusFilter] =
  useState("ALL");

  const [showCreateForm, setShowCreateForm] =
  useState(false);

  const filteredApplications = applications.filter(
  (application) => {

    const matchesSearch =
      application.applicationName
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesEnvironment =
      environmentFilter === "ALL" ||
      application.environment.toLowerCase() === environmentFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "ALL" ||
      application.status === statusFilter;

    return (
      matchesSearch &&
      matchesEnvironment &&
      matchesStatus
    );
  }
);

  useEffect(() => {

    const loadApplications = async () => {

      try {

        setLoading(true);

        const data = await getApplications();

        setApplications(data);

      } catch (error) {

        console.error(error);

        setError("Failed to load applications");

      } finally {

        setLoading(false);
      }
    };

    loadApplications();

  }, []);


  return (
    <div>

      {/* Header */}

  

<div className="mb-8 flex items-center justify-between">

  <div>
    <h1 className="text-3xl font-bold text-slate-900">
      Applications
    </h1>

    <p className="mt-2 text-slate-500">
      Manage and monitor registered applications.
    </p>
  </div>

  <button
    type="button"
    onClick={() => setShowCreateForm(!showCreateForm)}
    className="rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-slate-800"
  >
    {showCreateForm
      ? "Cancel"
      : "+ Create Application"}
  </button>

</div>
      {/* Error */}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}


      {/* Loading */}

      {loading && (
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">
            Loading applications...
          </p>
        </div>
      )}

        {/* Create Application Form */}
        {showCreateForm && (
  <div className="mb-6">

    <CreateApplicationForm
      onApplicationCreated={(application) => {

        setApplications((previous) => [
          application,
          ...previous,
        ]);

        setShowCreateForm(false);
      }}
    />

  </div>
)}
<div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

    {/* Search */}

    <div>

      <label className="mb-2 block text-sm font-medium text-slate-700">
        Search Application
      </label>

      <input
        type="text"
        placeholder="Search by application name..."
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
        className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
      />

    </div>


    {/* Environment */}

    <div>

      <label className="mb-2 block text-sm font-medium text-slate-700">
        Environment
      </label>

      <select
        value={environmentFilter}
        onChange={(event) =>
          setEnvironmentFilter(event.target.value)
        }
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 outline-none focus:border-slate-500"
      >

        <option value="ALL">
          All Environments
        </option>

        <option value="DEVELOPMENT">
          DEVLOPMENT
        </option>

        <option value="TESTING">
          TESTING
        </option>

        <option value="STAGING">
          STAGING
        </option>

        <option value="PRODUCTION">
          PRODUNCTION
        </option>

      </select>

    </div>


    {/* Status */}

    <div>

      <label className="mb-2 block text-sm font-medium text-slate-700">
        Status
      </label>

      <select
        value={statusFilter}
        onChange={(event) =>
          setStatusFilter(event.target.value)
        }
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 outline-none focus:border-slate-500"
      >

        <option value="ALL">
          All Statuses
        </option>

        <option value="ACTIVE">
          ACTIVE
        </option>

        <option value="INACTIVE">
          INACTIVE
        </option>

      </select>

    </div>

  </div>


  {/* Result count */}

  <div className="mt-4 flex items-center justify-between">

    <p className="text-sm text-slate-500">
      Showing {filteredApplications.length} of{" "}
      {applications.length} applications
    </p>

    <button
      type="button"
      onClick={() => {
        setSearch("");
        setEnvironmentFilter("ALL");
        setStatusFilter("ALL");
      }}
      className="text-sm font-medium text-slate-600 hover:text-slate-900"
    >
      Clear Filters
    </button>

  </div>

</div>

      {/* Table */}

      {!loading && !error && (

  filteredApplications.length > 0 ? (

    <ApplicationTable
                      applications={filteredApplications} onEdit={function (application: Application): void {
                          throw new Error("Function not implemented.");
                      } } onDelete={function (id: number): void {
                          throw new Error("Function not implemented.");
                      } }    />

  ) : (

    <div className="rounded-xl bg-white p-10 text-center shadow-sm">

      <h2 className="text-lg font-semibold text-slate-900">
        No applications found
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Try changing your search or filters.
      </p>

    </div>

  )

)}

      

    </div>
  );
}

export default Applications;