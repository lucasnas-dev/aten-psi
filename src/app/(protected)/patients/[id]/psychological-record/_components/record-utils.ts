export const formatDate = (date: string) => {
  const [year, month, day] = date.slice(0, 10).split("-");
  return year && month && day ? `${day}-${month}-${year}` : date;
};
