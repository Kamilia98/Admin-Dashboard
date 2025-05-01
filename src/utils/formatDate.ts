export const formatDate = (dateString: string): string => {
  try {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    const formatted = new Date(dateString).toLocaleDateString(
      undefined,
      options,
    );
    console.log(
      `[formatDate] Formatted date '${dateString}' as '${formatted}'`,
    );
    return formatted;
  } catch (err) {
    console.error('[formatDate] Error formatting date:', err);
    return 'Invalid date';
  }
};
