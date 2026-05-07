export function unixSecondsToString(unixSeconds: number | null) {
  return unixSeconds === null ? '' : new Date(unixSeconds*1000).toISOString();
}

export function formatPhoneNumber(phoneNumber: string | null) {
  return phoneNumber === null
    ? ''
    : phoneNumber.replace( /(\d{3})(\d{3})(\d{4})/, '($1) $2-$3' );
}