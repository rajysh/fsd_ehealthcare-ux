import React, { useEffect } from "react"

function Container(props) {
  return <div className={"container py-md-5 " + (props.wide ? "" : "container--narrow")}>{props.children}</div>
  //container container--narrow py-md-5
}

export default Container
