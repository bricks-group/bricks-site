/**
 * Help centre content model. Articles are typed data, rendered statically at /help.
 * Inline text supports two marks only: [label](href) links and **bold**.
 * Every fact must come from the product code, pricing source, terms or privacy policy.
 */
export type DiagramId =
  | 'camera-height' | 'perspective' | 'verticals' | 'push-in' | 'pan-arc' | 'locked-off'
  | 'drone-rise' | 'drone-orbit' | 'room-positions' | 'window-light' | 'clip-duration'
  | 'vv-walk-path' | 'vv-walk-speed' | 'vv-phone-height'

export type Block =
  | { t: 'p'; x: string }
  | { t: 'h2'; x: string }
  | { t: 'ul'; items: string[] }
  | { t: 'ol'; items: string[] }
  | { t: 'note'; x: string }
  | { t: 'table'; head: string[]; rows: string[][] }
  | { t: 'fig'; id: DiagramId; caption: string }
  | { t: 'flow'; steps: { k: string; v: string }[] }
  | { t: 'qa'; items: { q: string; a: string }[] }
  | { t: 'code'; x: string }

export type CollectionSlug =
  | 'getting-started' | 'booking' | 'changes-refunds' | 'plans-billing'
  | 'agents' | 'teams' | 'brokerages' | 'builders' | 'property-managers' | 'commercial' | 'investors' | 'reits'
  | 'integrations' | 'account-security' | 'photographers' | 'troubleshooting' | 'contact'

export type Collection = {
  slug: CollectionSlug
  title: string
  summary: string
  icon: string
  /** Client-type collections are grouped under "Help for your business" on the home page. */
  audience?: boolean
}

export type Article = {
  slug: string
  title: string
  summary: string
  body: Block[]
  /** Slugs of related articles (globally unique). */
  related?: string[]
  popular?: boolean
  /** The first numbered list is a set of steps: emit HowTo JSON-LD. */
  howto?: boolean
  updated?: string
}

export type ArticleWithCollection = Article & { collection: CollectionSlug; updated: string }
