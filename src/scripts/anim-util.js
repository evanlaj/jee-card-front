function delay(millseconds) {
  return new Promise(result => setTimeout(result, millseconds));
}

export { delay };
