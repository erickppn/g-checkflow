import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/cheques/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/cheques/"!</div>
}
