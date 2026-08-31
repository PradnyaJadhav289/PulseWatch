import type { HourlyAnalytics } from "../types/hourlyAnalytics";


// ============================================================
// DAILY ANALYTICS
// ============================================================
//
// Used for long date ranges such as:
// - Last 7 Days
// - Custom ranges greater than 2 days
//
// It converts hourly data into one point per day.
//
// It also creates entries for days where there were
// no API requests.
// ============================================================

export interface DailyAnalytics {

  time: string;

  requestCount: number;

  errorCount: number;

  averageResponseTime: number | null;
}


// ============================================================
// FORMAT DATE AS YYYY-MM-DD
// ============================================================

const formatDate = (
  date: Date
): string => {

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


// ============================================================
// AGGREGATE HOURLY DATA INTO DAILY DATA
// ============================================================

export const aggregateDailyAnalytics = (
  hourlyData: HourlyAnalytics[],
  from: string,
  to: string
): DailyAnalytics[] => {


  // ==========================================================
  // STEP 1
  // Group existing hourly data by date
  // ==========================================================

  const grouped: Record<
    string,
    {
      requestCount: number;
      errorCount: number;
      totalResponseTime: number;
    }
  > = {};


  hourlyData.forEach((item) => {

    const date =
      formatDate(
        new Date(item.time)
      );


    if (!grouped[date]) {

      grouped[date] = {

        requestCount: 0,

        errorCount: 0,

        totalResponseTime: 0,
      };
    }


    grouped[date].requestCount +=
      item.requestCount;


    grouped[date].errorCount +=
      item.errorCount;


    // Weighted response time
    //
    // Example:
    //
    // 10 requests × 200 ms
    // 20 requests × 300 ms
    //
    // This allows us to calculate the
    // correct daily average later.

    // Only calculate response time when a valid
// response-time value exists.
//
// If there were no requests, averageResponseTime
// can be null, so we must not multiply null.

if (
  item.averageResponseTime !== null &&
  item.requestCount > 0
) {

  grouped[date].totalResponseTime +=
    item.averageResponseTime *
    item.requestCount;
}
  });


  // ==========================================================
  // STEP 2
  // Create every date between FROM and TO
  // ==========================================================

  const result: DailyAnalytics[] = [];

  const current =
    new Date(from);

  const end =
    new Date(to);


  current.setHours(
    0,
    0,
    0,
    0
  );


  end.setHours(
    0,
    0,
    0,
    0
  );


  while (
    current.getTime() <=
    end.getTime()
  ) {

    const date =
      formatDate(current);


    // ========================================================
    // Day has metrics
    // ========================================================

    if (grouped[date]) {

      const data =
        grouped[date];


      result.push({

        time:
          `${date}T00:00:00`,

        requestCount:
          data.requestCount,

        errorCount:
          data.errorCount,

        averageResponseTime:
          data.requestCount > 0
            ? data.totalResponseTime /
              data.requestCount
            : null,
      });

    }


    // ========================================================
    // Day has NO metrics
    // ========================================================

    else {

      result.push({

        time:
          `${date}T00:00:00`,

        requestCount: 0,

        errorCount: 0,

        // IMPORTANT:
        // No requests means there is no
        // meaningful response-time average.
        averageResponseTime: null,
      });
    }


    // Move to next day

    current.setDate(
      current.getDate() + 1
    );
  }


  return result;
};