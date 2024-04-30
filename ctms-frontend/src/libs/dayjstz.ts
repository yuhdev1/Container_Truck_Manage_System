import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/vi";
var customParseFormat = require("dayjs/plugin/customParseFormat");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
// dayjs.tz.setDefault("UTC");

const timezonedDayjs = (...args: any[]) => {
  // return dayjs(...args).tz();
  return dayjs(...args).local();
};

const timezonedUnix = (value: number) => {
  return dayjs.unix(value).tz();
};

timezonedDayjs.unix = timezonedUnix;

export default timezonedDayjs;
