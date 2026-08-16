import { useState } from "react";
import type { Application } from "../types/application";
import api from "../services/api";

interface CreateApplicationFormProps {
  onApplicationCreated: (application: Application) => void;
}

function CreateApplicationForm({
  onApplicationCreated,
}: CreateApplicationFormProps) {

  const [formData, setFormData] = useState({
    applicationName: "",
    ownerTeam: "",
    environment: "DEVELOPMENT",
    baseUrl: "",
    description: "",
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {

    event.preventDefault();

    try {

      setLoading(true);
      setError("");

      const response = await api.post<Application>(
        "/applications",
        formData
      );

      onApplicationCreated(response.data);

      setFormData({
        applicationName: "",
        ownerTeam: "",
        environment: "DEVELOPMENT",
        baseUrl: "",
        description: "",
        status: "ACTIVE",
      });

    } catch (error) {

      console.error(error);

      setError("Failed to create application");

    } finally {

      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl bg-white p-6 shadow-sm"
    >

      <h2 className="mb-6 text-xl font-semibold text-slate-900">
        Create Application
      </h2>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        {/* Application Name */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Application Name
          </label>

          <input
            name="applicationName"
            value={formData.applicationName}
            onChange={handleChange}
            required
            placeholder="Payment Service"
            className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
          />
        </div>

        {/* Owner Team */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Owner Team
          </label>

          <input
            name="ownerTeam"
            value={formData.ownerTeam}
            onChange={handleChange}
            required
            placeholder="Backend Team"
            className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
          />
        </div>

        {/* Environment */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Environment
          </label>

          <select
            name="environment"
            value={formData.environment}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2"
          >
            <option value="DEVELOPMENT">
              DEVELOPMENT
            </option>

            <option value="TEST">
              TEST
            </option>

            <option value="STAGING">
              STAGING
            </option>

            <option value="PRODUCTION">
              PRODUCTION
            </option>
          </select>
        </div>

        {/* Status */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Status
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2"
          >
            <option value="ACTIVE">
              ACTIVE
            </option>

            <option value="INACTIVE">
              INACTIVE
            </option>
          </select>
        </div>

        {/* Base URL */}

        <div className="md:col-span-2">

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Base URL
          </label>

          <input
            name="baseUrl"
            type="url"
            value={formData.baseUrl}
            onChange={handleChange}
            required
            placeholder="https://api.example.com"
            className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
          />

        </div>

        {/* Description */}

        <div className="md:col-span-2">

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe the application..."
            className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
          />

        </div>

      </div>

      <div className="mt-6 flex justify-end">

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Application"}
        </button>

      </div>

    </form>
  );
}

export default CreateApplicationForm;