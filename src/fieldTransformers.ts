export function unixSecondsToString(unixSeconds: number | null) {
  return unixSeconds === null ? '' : new Date(unixSeconds*1000).toISOString();
}

export function formatPhoneNumber(phoneNumber: string | null) {
  if (phoneNumber === null)
    return '';
  else if (phoneNumber.length === 10)
    return phoneNumber.replace( /(\d{3})(\d{3})(\d{4})/, '($1) $2-$3' );
  else if (phoneNumber.length === 11)
    return phoneNumber.replace( /(\d{1})(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4' );
  else
    return phoneNumber;
}