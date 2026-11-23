import { createFileRoute } from '@tanstack/react-router'
import { Legal, legalHead } from '../components/sections/Legal'
export const Route = createFileRoute('/privacy')({
  head: () => legalHead('privacy'),
  component: () => <Legal kind="privacy" />,
})
