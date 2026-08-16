import { useEffect, useState } from "react";

import {
  getApplications,
  deleteApplication,
} from "../services/applicationService";

import type { Application } from "../types/application";

import ApplicationTable from "../components/ApplicationTable";
import ApplicationForm from "../components/ApplicationForm";


function Applications() {

  // ============================================================
  // APPLICATIONS
  // ============================================================

  const [applications, setApplications] =
    useState<Application[]>([]);


  // ============================================================
  // LOADING & ERROR
  // ============================================================

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  // ============================================================
  // FILTERS
  // ============================================================

  const [search, setSearch] =
    useState("");

  const [environmentFilter, setEnvironmentFilter] =
    useState("ALL");

  const [statusFilter, setStatusFilter] =
    useState("ALL");


  // ============================================================
  // FORM STATE
  // ============================================================

  // Controls whether the ApplicationForm is visible
  const [showCreateForm, setShowCreateForm] =
    useState(false);

  // NEW:
  // Stores the application currently being edited.
  //
  // null = Create mode
  // Application object = Edit mode
  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null);


  // ============================================================
  // FILTER APPLICATIONS
  // ============================================================

  const filteredApplications =
    applications.filter((application) => {

      const matchesSearch =
        application.applicationName
          .toLowerCase()
          .includes(search.toLowerCase());


      const matchesEnvironment =
        environmentFilter === "ALL" ||
        application.environment.toLowerCase() ===
          environmentFilter.toLowerCase();


      const matchesStatus =
        statusFilter === "ALL" ||
        application.status.toLowerCase() ===
          statusFilter.toLowerCase();


      return (
        matchesSearch &&
        matchesEnvironment &&
        matchesStatus
      );
    });


  // ============================================================
  // LOAD APPLICATIONS
  // ============================================================

  useEffect(() => {

    const loadApplications = async () => {

      try {

        setLoading(true);
        setError(null);

        const data =
          await getApplications();

        setApplications(data);

      } catch (error) {

        console.error(error);

        setError(
          "Failed to load applications"
        );

      } finally {

        setLoading(false);
      }
    };


    loadApplications();

  }, []);


  // ============================================================
  // DELETE / DEACTIVATE APPLICATION
  // ============================================================

  const handleDelete = async (id: number) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to deactivate this application?"
      );


    if (!confirmed) {
      return;
    }


    try {

      await deleteApplication(id);


      // Remove it from the current table.
      //
      // IMPORTANT:
      // Your backend currently performs soft delete,
      // meaning the database record remains INACTIVE.
      setApplications((previous) =>
        previous.filter(
          (application) =>
            application.id !== id
        )
      );


    } catch (error) {

      console.error(error);

      setError(
        "Failed to deactivate application"
      );
    }
  };


  // ============================================================
  // START EDITING
  // ============================================================

  const handleEdit = (
    application: Application
  ) => {

    // Store selected application
    setEditingApplication(application);

    // Show the form
    setShowCreateForm(true);
  };


  // ============================================================
  // CANCEL FORM
  // ============================================================

  const handleCancelForm = () => {

    // Remove selected application
    setEditingApplication(null);

    // Hide form
    setShowCreateForm(false);
  };


  // ============================================================
  // APPLICATION SAVED
  // ============================================================

  const handleApplicationSaved = (
    application: Application
  ) => {

    setApplications((previous) => {

      // Check whether this application
      // already exists in our current list.
      const exists =
        previous.some(
          (item) =>
            item.id === application.id
        );


      // ========================================================
      // EDIT MODE
      // ========================================================

      if (exists) {

        return previous.map((item) =>
          item.id === application.id
            ? application
            : item
        );
      }


      // ========================================================
      // CREATE MODE
      // ========================================================

      return [
        application,
        ...previous,
      ];
    });


    // Close the form
    setShowCreateForm(false);

    // Clear edit state
    setEditingApplication(null);
  };


  // ============================================================
  // UI
  // ============================================================

  return (

    <div>


      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Applications
          </h1>

          <p className="mt-2 text-slate-500">
            Manage and monitor registered applications.
          </p>

        </div>


        {/* CREATE / CANCEL BUTTON */}

        <button
          type="button"
          onClick={() => {

            // If form is already open,
            // close it.
            if (showCreateForm) {

              handleCancelForm();

            } else {

              // Open form in CREATE mode.
              setEditingApplication(null);
              setShowCreateForm(true);

            }

          }}
          className="rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-slate-800"
        >

          {showCreateForm
            ? "Cancel"
            : "+ Create Application"}

        </button>

      </div>


      {/* ======================================================
          ERROR
          ====================================================== */}

      {error && (

        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600">

          {error}

        </div>

      )}


      {/* ======================================================
          LOADING
          ====================================================== */}

      {loading && (

        <div className="rounded-xl bg-white p-8 text-center shadow-sm">

          <p className="text-slate-500">
            Loading applications...
          </p>

        </div>

      )}


      {/* ======================================================
          APPLICATION FORM
          ====================================================== */}

      {showCreateForm && (

        <div className="mb-6">

          <ApplicationForm

            // IMPORTANT:
            // null/undefined → Create mode
            // existing application → Edit mode
            application={
              editingApplication ?? undefined
            }


            // Called after POST or PUT succeeds
            onApplicationSaved={
              handleApplicationSaved
            }


            // Called when Cancel is clicked
            onCancel={
              handleCancelForm
            }

          />

        </div>

      )}


      {/* ======================================================
          FILTERS
          ====================================================== */}

      <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">


          {/* SEARCH */}

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


          {/* ENVIRONMENT */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Environment
            </label>

            <select
              value={environmentFilter}
              onChange={(event) =>
                setEnvironmentFilter(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 outline-none focus:border-slate-500"
            >

              <option value="ALL">
                All Environments
              </option>

              <option value="DEVELOPMENT">
                DEVELOPMENT
              </option>

              <option value="TESTING">
                TESTING
              </option>

              <option value="STAGING">
                STAGING
              </option>

              <option value="PRODUCTION">
                PRODUCTION
              </option>

            </select>

          </div>


          {/* STATUS */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
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


        {/* RESULT COUNT */}

        <div className="mt-4 flex items-center justify-between">

          <p className="text-sm text-slate-500">

            Showing{" "}
            {filteredApplications.length}{" "}
            of{" "}
            {applications.length}{" "}
            applications

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


      {/* ======================================================
          APPLICATION TABLE
          ====================================================== */}

      {!loading && !error && (

        filteredApplications.length > 0 ? (

          <ApplicationTable

            applications={
              filteredApplications
            }

            // UPDATED:
            // Real edit handler instead of console.log
            onEdit={
              handleEdit
            }

            onDelete={
              handleDelete
            }

          />

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