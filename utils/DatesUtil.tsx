import moment from "moment";

export function getThisMonthDates(
  startDate: moment.Moment,
  endDate: moment.Moment
): moment.Moment[] {
  let dateArray = [];
  while (startDate <= endDate) {
    dateArray.push(moment(startDate));
    startDate = moment(startDate).add(1, "days");
  }
  return dateArray;
}
