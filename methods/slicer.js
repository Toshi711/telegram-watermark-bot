function slicer(arr, div) {
    let out = [];
    for(let i = 0; i < Math.ceil(arr.length / div); i++) {
      out.push(arr.slice(i*div, i*div+div));
    }
    return out;
  }


export default slicer
