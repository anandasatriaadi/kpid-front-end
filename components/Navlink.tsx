import Link from 'next/link';
import { useRouter } from 'next/router'
import React from 'react'

interface Props {
  title: string,
  route: string
}

function Navlink(props: Props) {
  const route = useRouter();
  return (
    <Link href={props.route}>
      <a className={props.route == route.asPath ? "nav-link-active" : "nav-link"}>{props.title}</a>
    </Link>
  )
}

export default Navlink