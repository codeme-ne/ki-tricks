import { safeJSONStringify } from '@/lib/utils/schema-markup'

interface SchemaMarkupProps {
  schema: any
  id?: string
}

export function SchemaMarkup({ schema, id }: SchemaMarkupProps) {
  const jsonLd = safeJSONStringify(schema)

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  )
}

export default SchemaMarkup