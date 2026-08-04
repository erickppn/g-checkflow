import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/operacoes/nova')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/cheques/operacoes/nova"!</div>
}
