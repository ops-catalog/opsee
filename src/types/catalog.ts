export interface Contact {
  id: string;
  fqId?: string;
  type: string;
  intent?: string;
}

export interface ContactInfo {
  owner: Contact;
  contributors?: Contact[];
  support?: Contact[];
  participants?: Contact[];
}

export interface Classification {
  tag: string | null;
  domain: string;
  team: string;
  capability: string;
}

export interface Dependencies {
  upstream: string[];
  downstream: string[];
  triggers: string[] | null;
  providedBy?: string;
}

export interface Properties {
  lifecycle?: Record<string, unknown>;
  build?: Record<string, unknown>;
  dev?: Record<string, unknown>;
  resources?: Record<string, unknown>;
  operations?: Record<string, unknown>;
}

export interface Endpoint {
  intent: string;
  location: string;
}

export interface Runtime {
  endpoint?: Endpoint[];
}

export interface Link {
  type: string;
  url: string;
  classifier?: string;
}

export interface DebtEntry {
  name: string;
  description: string;
  severity: string;
}

export interface Debt {
  entries: DebtEntry[];
}

export interface Score {
  value: number;
  label: string;
}

export interface Operation {
  name: string;
  updated: string;
  description: string;
}

export interface Audit {
  source: string;
  operations: Operation[];
}

export interface Metadata {
  name: string;
  description: string;
  labels: Record<string, string>;
  annotations?: Record<string, string>;
  contact?: string;
  license: string;
  tier?: string;
  logo?: string;
}

export interface CatalogItem {
  id: string;
  apiVersion: string;
  class: string;
  kind: string;
  metadata: Metadata;
  contact: ContactInfo;
  dependencies: Dependencies;
  classification: Classification;
  properties: Properties;
  audit: Audit;
  debt: Debt;
  runtime: Runtime;
  links?: Link[];
  score: Score;
}

export interface CatalogData {
  data: CatalogItem[];
  meta: {
    count: number;
  };
} 