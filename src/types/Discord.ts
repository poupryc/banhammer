export namespace Discord {
  interface Page {
    id: string
    name: string
    url: string
    updated_at: Date
  }

  interface AffectedComponent {
    name: string
  }

  interface IncidentUpdate {
    status: string
    body: string
    created_at: Date
    updated_at: Date
    display_at: Date
    affected_components: AffectedComponent[]
    custom_tweet?: any
    deliver_notifications: boolean
    id: string
    incident_id: string
  }

  export interface Incident {
    name: string
    status: string
    created_at: Date
    updated_at: Date
    monitoring_at?: Date
    resolved_at: Date
    shortlink: string
    id: string
    page_id: string
    incident_updates: IncidentUpdate[]
    impact: string
  }

  export interface Incident {
    page: Page
    incidents: Incident[]
  }
}
