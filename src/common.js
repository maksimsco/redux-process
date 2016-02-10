export function TimeoutException(message) {
  this.name = 'TimeoutException';
  this.message = message;
  this.stack = (new Error()).stack;
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function timeout(ms) {
  return delay(ms).then(() => {
    throw new TimeoutException('The timeout period elapsed prior to completion of the operation.');
  });
}
