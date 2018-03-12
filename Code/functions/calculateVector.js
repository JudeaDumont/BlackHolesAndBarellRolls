//Return an array of [WorldXDelta, WorldYDelta]
  export default calculateVector = (speed, angle) => {
    return [
      Math.floor((speed * Math.sin(angle * Math.PI / 180))),
      Math.floor((speed * Math.cos(angle * Math.PI / 180))),
    ]
  }