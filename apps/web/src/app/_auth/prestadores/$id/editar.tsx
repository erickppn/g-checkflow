import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/prestadores/$id/editar')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/prestadores/$id/editar"!</div>
}
