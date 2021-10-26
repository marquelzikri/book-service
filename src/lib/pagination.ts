function getPagination(page: string, pageSize: string) {
  const parsedPage = parseInt(page || '1');
  const parsedPageSize = parseInt(pageSize || '10');
  console.log(parsedPage, parsedPageSize)

  return {
    take: parsedPageSize,
    skip: parsedPageSize * (parsedPage - 1),
  };
}

export default getPagination;
