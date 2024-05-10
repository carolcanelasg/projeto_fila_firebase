export default class ViewerError extends Error {
  
  constructor(txtDeErro) {
    super(txtDeErro);
    console.log(txtDeErro + "\n\n" + this.stack);
  }
}
