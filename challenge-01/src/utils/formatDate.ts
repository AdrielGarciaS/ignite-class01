const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(date);

export default formatDate;
