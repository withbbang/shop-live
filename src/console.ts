if (import.meta.env.VITE_MODE === 'production') {
  console.debug = () => {};
  console.log = () => {};
  // console.info = () => {};
  // console.warn = () => {};
  // console.error = () => {};
}
