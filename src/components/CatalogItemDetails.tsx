import React, { useEffect, useRef } from 'react';
import { CatalogItem, Contact, Link as LinkType, DebtEntry, AuditOperation } from '@/types/catalog'; // Renamed Link to LinkType
import { getItemIcon, getScoreColor, getKindColor } from '@/utils/catalog';
import classNames from 'classnames';
import { 
  XMarkIcon, 
  LinkIcon, 
  CodeBracketIcon, 
  ChartBarIcon, 
  DocumentTextIcon, 
  UserCircleIcon, 
  UsersIcon, 
  ChatBubbleLeftEllipsisIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  ExclamationTriangleIcon, // For high severity
  InformationCircleIcon, // For medium severity
  CheckCircleIcon, // For low severity (or a more neutral one)
} from '@heroicons/react/24/outline';

interface CatalogItemDetailsProps {
  item: CatalogItem | null;
  onClose: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <div className={classNames("mb-6", className)}>
    {/* Section titles are sticky within their scrolling container (PanelContent) */}
    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 sticky top-0 bg-white dark:bg-gray-800 py-3 z-10 border-b dark:border-gray-700 -mx-6 px-6">
      {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const DetailItem: React.FC<{ label: string; value?: React.ReactNode; className?: string }> = ({ label, value, className }) => {
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    // Allow boolean false and number 0 to be displayed
    if (typeof value === 'boolean' || typeof value === 'number') {
      // This block is intentionally empty to allow the value to be processed below
    } else {
      return null;
    }
  }
  return (
    <div className={classNames("py-1.5", className)}> {/* Increased py slightly */}
      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">{label.replace(/([A-Z])/g, ' $1').trim()}</h4>
      {typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? (
        <p className="text-md text-gray-900 dark:text-gray-100">{String(value)}</p>
      ) : (
        <div className="text-md text-gray-900 dark:text-gray-100">{value}</div>
      )}
    </div>
  );
};

const PropertiesDisplay: React.FC<{ properties: Record<string, any>; level?: number }> = ({ properties, level = 0 }) => {
  return (
    <div className={classNames(level > 0 ? 'ml-4 pl-4 border-l border-gray-200 dark:border-gray-700' : '')}>
      {Object.entries(properties).map(([key, value]) => (
        <div key={key} className="py-1">
          <h5 className={classNames("font-medium capitalize", 
            level === 0 ? "text-gray-700 dark:text-gray-300" : "text-gray-600 dark:text-gray-400",
            level === 0 ? "text-md" : "text-sm"
          )}>
            {key.replace(/([A-Z])/g, ' $1').trim()}:
          </h5>
          {typeof value === 'object' && value !== null ? (
            <PropertiesDisplay properties={value} level={level + 1} />
          ) : (
            <p className={classNames("text-gray-800 dark:text-gray-200", level === 0 ? "text-md" : "text-sm")}>{String(value)}</p>
          )}
        </div>
      ))}
    </div>
  );
};

const ContactItem: React.FC<{ contact: Contact; role: string }> = ({ contact, role }) => {
  let icon = <UserCircleIcon className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />;
  let linkHref: string | undefined = undefined;

  if (contact.fqId) {
    if (contact.fqId.startsWith('mailto:')) {
      icon = <EnvelopeIcon className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />;
      linkHref = contact.fqId;
    } else if (contact.fqId.startsWith('tel:')) {
      icon = <PhoneIcon className="w-5 h-5 mr-2 text-green-500 dark:text-green-400" />;
      linkHref = contact.fqId;
    } else if (contact.fqId.startsWith('slack://')) {
      icon = <ChatBubbleLeftEllipsisIcon className="w-5 h-5 mr-2 text-purple-500 dark:text-purple-400" />;
      linkHref = contact.fqId;
    } else if (contact.fqId.startsWith('id://')) {
      // Potentially link to an internal profile if a pattern exists
      // For now, just display the ID
      icon = <UsersIcon className="w-5 h-5 mr-2 text-teal-500 dark:text-teal-400" />;
    }
  }

  return (
    <div className="py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize flex items-center">
        {icon}
        {role}
      </h5>
      <p className="text-sm text-gray-600 dark:text-gray-400 ml-7">
        ID: {contact.id} ({contact.type})
      </p>
      {contact.intent && (
        <p className="text-xs text-gray-500 dark:text-gray-500 ml-7">Intent: {contact.intent}</p>
      )}
      {contact.fqId && (
        <p className="text-xs text-gray-500 dark:text-gray-500 ml-7">
          FQID: {linkHref ? (
            <a href={linkHref} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
              {contact.fqId.startsWith('mailto:') ? contact.fqId.substring(7) : contact.fqId}
            </a>
          ) : (
            contact.fqId
          )}
        </p>
      )}
      {contact.description && <p className="text-xs text-gray-500 dark:text-gray-500 ml-7">{contact.description}</p>}
    </div>
  );
};


export default function CatalogItemDetails({ item, onClose }: CatalogItemDetailsProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    // Also handle click outside for the panel itself if needed, though overlay handles most cases
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        // Check if the click was outside the panel.
        // This might be redundant if overlay click is sufficient.
        // onClose(); 
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!item) return null;

  const scoreColorClass = getScoreColor(item.score.label);
  const kindColorClass = getKindColor(item.kind);

  return (
    <div
      className={classNames(
        "fixed inset-0 z-40 transition-opacity duration-300 ease-in-out",
        item ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-75"
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div
        ref={panelRef}
        className={classNames(
          "fixed top-0 right-0 h-full bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 ease-in-out z-50 flex flex-col", // Added flex flex-col
          "w-full md:w-3/5 lg:w-2/5 xl:w-1/3", // Responsive width
          item ? "transform translate-x-0" : "transform translate-x-full"
        )}
      >
        {/* Panel Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-20"> {/* Changed p-4 to p-5, removed sticky as parent is flex col */}
          <div className="flex items-center space-x-4"> {/* Increased space-x */}
            <div className="text-3xl text-gray-700 dark:text-gray-300">{getItemIcon(item.class)}</div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 truncate" title={item.metadata.name}> {/* Increased font-size and weight */}
              {item.metadata.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close panel" // Added aria-label
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-blue-500" // Enhanced button style
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-6"> {/* Added flex-1 for scroll, removed fixed height */}
          <Section title="Overview">
            <DetailItem label="Description" value={item.metadata.description || 'No description provided'} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4"> {/* Changed to 1 col on small screens */}
              <DetailItem label="Kind" value={<span className={classNames("px-2 py-0.5 text-xs font-medium rounded-full inline-block", kindColorClass)}>{item.kind}</span>} />
              <DetailItem label="Class" value={<span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 inline-block">{item.class}</span>} />
            </div>
            <DetailItem 
              label="Score" 
              value={
                <div className="flex items-center">
                  <span className={classNames("w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-2", scoreColorClass)}>
                    {item.score.label}
                  </span>
                  <span className="text-lg font-semibold">{item.score.value}</span>
                </div>
              } 
            />
            <DetailItem label="Tier" value={item.metadata.tier} />
            <DetailItem label="License" value={item.metadata.license} />
          </Section>

          <Section title="Contacts">
            {item.contact.owner && <ContactItem contact={item.contact.owner} role="Owner" />}
            {item.contact.contributors && item.contact.contributors.length > 0 && 
              item.contact.contributors.map((c, idx) => <ContactItem key={`contrib-${idx}`} contact={c} role={`Contributor ${idx+1}`} />)
            }
            {item.contact.support && item.contact.support.length > 0 &&
              item.contact.support.map((s, idx) => <ContactItem key={`support-${idx}`} contact={s} role={`Support Channel ${idx+1}`} />)
            }
            {item.contact.participants && item.contact.participants.length > 0 &&
              item.contact.participants.map((p, idx) => <ContactItem key={`participant-${idx}`} contact={p} role={`Participant ${idx+1}`} />)
            }
            {/* Removed stray </div></div> tags */}
          </Section>

          <Section title="Classification">
            <DetailItem label="Domain" value={item.classification.domain} />
            <DetailItem label="Team" value={item.classification.team} />
            <DetailItem label="Capability" value={item.classification.capability} />
            <DetailItem label="Tag" value={item.classification.tag} />
          </Section>

          <Section title="Dependencies">
            <DetailItem label="Upstream" value={item.dependencies.upstream?.join(', ')} />
            <DetailItem label="Downstream" value={item.dependencies.downstream?.join(', ')} />
            <DetailItem label="Triggers" value={item.dependencies.triggers?.join(', ')} />
            <DetailItem label="Provided By" value={item.dependencies.providedBy} />
          </Section>

          {item.links && item.links.length > 0 && (
            <Section title="Links">
              {item.links.map((link: LinkType, index: number) => {
                let IconComponent = LinkIcon;
                const type = link.type?.toLowerCase();
                const classifier = link.classifier?.toLowerCase();

                if (type === 'source-code' || type === 'repository' || classifier === 'source-code' || classifier === 'repo') IconComponent = CodeBracketIcon;
                else if (type === 'dashboard' || classifier === 'dashboard') IconComponent = ChartBarIcon;
                else if (type === 'documentation' || type === 'docs' || classifier === 'documentation' || classifier === 'docs') IconComponent = DocumentTextIcon;
                
                return (
                  <div key={index} className="py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 dark:text-blue-400 hover:underline group"
                    >
                      <IconComponent className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                      <span className="flex-1 break-all">{link.url}</span>
                    </a>
                    {(link.type || link.classifier) && (
                       <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 ml-7"> {/* Added mt-1 */}
                        Type: {link.type || 'N/A'} {link.classifier && `(${link.classifier})`}
                      </p>
                    )}
                    {link.description && <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 ml-7">{link.description}</p>} {/* Added mt-1 */}
                  </div>
                );
              })}
            </Section>
          )}

          {item.properties && Object.keys(item.properties).length > 0 && (
            <Section title="Properties">
              <PropertiesDisplay properties={item.properties} />
            </Section>
          )}

          {item.runtime?.endpoint && (
            <Section title="Runtime Information">
              <DetailItem label="Endpoint" value={item.runtime.endpoint} />
            </Section>
          )}

          {item.debt?.entries && item.debt.entries.length > 0 && (
            <Section title="Technical Debt">
              {item.debt.entries.map((entry: DebtEntry, index: number) => {
                let SeverityIcon = InformationCircleIcon;
                let severityColor = "text-gray-500 dark:text-gray-400"; // Default color for undefined severity
                let severityText = entry.severity || "Undefined";

                if (entry.severity?.toLowerCase() === 'high') {
                  SeverityIcon = ExclamationTriangleIcon;
                  severityColor = "text-red-500 dark:text-red-400";
                } else if (entry.severity?.toLowerCase() === 'medium') {
                  SeverityIcon = InformationCircleIcon;
                  severityColor = "text-orange-500 dark:text-orange-400";
                } else if (entry.severity?.toLowerCase() === 'low') {
                  SeverityIcon = CheckCircleIcon;
                  severityColor = "text-yellow-500 dark:text-yellow-400";
                }

                return (
                  <div key={index} className="py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-1">{entry.name}</h4>
                    {entry.description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-1.5">{entry.description}</p>}
                    <div className={classNames("flex items-center text-xs font-medium", severityColor)}>
                      <SeverityIcon className={classNames("w-4 h-4 mr-1.5", severityColor)} />
                      Severity: {severityText}
                    </div>
                  </div>
                );
              })}
            </Section>
          )}

          {item.audit?.operations && item.audit.operations.length > 0 && (
             <Section title="Audit Log">
              {item.audit.operations.map((op: AuditOperation, index: number) => (
                <div key={index} className="py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">{op.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{op.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Updated: {new Date(op.updated).toLocaleString()} by {op.updatedBy}
                  </p>
                </div>
              ))}
            </Section>
          )}
          
          <Section title="Metadata Details">
            <DetailItem label="API Version" value={item.apiVersion} />
            <DetailItem label="ID" value={item.id} className="break-all" />
            {item.metadata.labels && Object.keys(item.metadata.labels).length > 0 && (
              <DetailItem 
                label="Labels" 
                value={<pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded-md overflow-x-auto">{JSON.stringify(item.metadata.labels, null, 2)}</pre>} 
              />
            )}
            {item.metadata.annotations && Object.keys(item.metadata.annotations).length > 0 && (
              <DetailItem 
                label="Annotations" 
                value={<pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded-md overflow-x-auto">{JSON.stringify(item.metadata.annotations, null, 2)}</pre>} 
              />
            )}
          </Section>

        </div>
      </div>
    </div>
  );
}