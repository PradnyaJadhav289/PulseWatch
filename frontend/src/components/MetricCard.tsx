interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
}

function MetricCard({
  title,
  value,
  description,
}: MetricCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </h2>

      {description && (
        <p className="mt-2 text-sm text-slate-400">
          {description}
        </p>
      )}

    </div>
  );
}

export default MetricCard;