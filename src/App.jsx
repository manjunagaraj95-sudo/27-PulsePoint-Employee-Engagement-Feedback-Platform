
import React, { useState } from 'react';

const ROLES = {
    ADMIN: {
        label: 'Admin',
        canManageSurveys: true,
        canManageFeedback: true,
        canManageRecognition: true,
        canViewAllReports: true,
        canCreateSurvey: true,
        canEditAnyData: true,
        canPerformBulkActions: true,
        canViewAuditLogs: true,
    },
    EXECUTIVE: {
        label: 'Executive',
        canManageSurveys: false,
        canManageFeedback: false,
        canManageRecognition: false,
        canViewAllReports: true,
        canCreateSurvey: false,
        canEditAnyData: false,
        canPerformBulkActions: false,
        canViewAuditLogs: true,
    },
    MANAGER: {
        label: 'Manager',
        canManageSurveys: true, // Can manage their team's surveys
        canManageFeedback: true, // Can review their team's feedback
        canManageRecognition: true, // Can approve recognition
        canViewAllReports: true, // Can view team reports
        canCreateSurvey: true, // Can create team surveys
        canEditAnyData: true, // Limited to team data
        canPerformBulkActions: false,
        canViewAuditLogs: false,
    },
    EMPLOYEE: {
        label: 'Employee',
        canManageSurveys: false,
        canManageFeedback: true, // Can give feedback
        canManageRecognition: true, // Can give/receive recognition
        canViewAllReports: false,
        canCreateSurvey: false,
        canEditAnyData: false,
        canPerformBulkActions: false,
        canViewAuditLogs: false,
    },
};

const STATUS_MAPPING = {
    DRAFT: { label: 'Draft', color: 'var(--color-info)' },
    ACTIVE: { label: 'Active', color: 'var(--color-success)' },
    COMPLETED: { label: 'Completed', color: 'var(--color-secondary)' },
    ARCHIVED: { label: 'Archived', color: 'var(--color-text-secondary)' },
    NEW: { label: 'New', color: 'var(--color-info)' },
    REVIEWED: { label: 'Reviewed', color: 'var(--color-primary)' },
    POSITIVE: { label: 'Positive', color: 'var(--color-success)' },
    NEUTRAL: { label: 'Neutral', color: 'var(--color-info)' },
    NEGATIVE: { label: 'Negative', color: 'var(--color-danger)' },
    PENDING: { label: 'Pending', color: 'var(--color-warning)' },
    APPROVED: { label: 'Approved', color: 'var(--color-success)' },
    REJECTED: { label: 'Rejected', color: 'var(--color-danger)' },
    'IN_PROGRESS': { label: 'In Progress', color: 'var(--color-primary)' },
    OVERDUE: { label: 'Overdue', color: 'var(--color-danger)' },
    PUBLISHED: { label: 'Published', color: 'var(--color-success)' },
};

const DUMMY_DATA = {
    surveys: [
        { id: 'S001', title: 'Q1 Pulse Check', status: 'ACTIVE', type: 'Pulse', department: 'All', responseRate: '75%', startDate: '2023-01-01', endDate: '2023-01-15', creator: 'HR Admin', description: 'A quick survey to gauge employee morale at the start of Q1.' },
        { id: 'S002', title: 'New Hire Onboarding Experience', status: 'COMPLETED', type: 'Onboarding', department: 'HR', responseRate: '90%', startDate: '2022-12-01', endDate: '2022-12-31', creator: 'HR Admin', description: 'Feedback on the onboarding process for new employees.' },
        { id: 'S003', title: 'Team Morale Boosters', status: 'DRAFT', type: 'Micro', department: 'Marketing', responseRate: '0%', startDate: '2023-02-01', endDate: '2023-02-07', creator: 'Manager A', description: 'Gather ideas for team-building activities.' },
        { id: 'S004', title: 'Work-Life Balance Initiative', status: 'ACTIVE', type: 'Annual', department: 'All', responseRate: '60%', startDate: '2023-03-01', endDate: '2023-03-31', creator: 'HR Admin', description: 'Understanding employee perceptions of work-life balance.' },
        { id: 'S005', title: 'Project X Retrospective', status: 'COMPLETED', type: 'Project', department: 'Engineering', responseRate: '85%', startDate: '2022-11-15', endDate: '2022-11-20', creator: 'Manager B', description: 'Post-mortem survey for Project X learnings.' },
        { id: 'S006', title: 'Remote Work Satisfaction', status: 'ARCHIVED', type: 'Pulse', department: 'All', responseRate: '70%', startDate: '2022-09-01', endDate: '2022-09-10', creator: 'HR Admin', description: 'Survey conducted during the peak remote work period.' },
        { id: 'S007', title: 'Department Goals Alignment', status: 'ACTIVE', type: 'Strategic', department: 'Sales', responseRate: '50%', startDate: '2023-04-01', endDate: '2023-04-15', creator: 'Manager C', description: 'Assess how well team members understand and align with department goals.' },
    ],
    feedbacks: [
        { id: 'F001', title: 'Concern about project deadlines', status: 'NEW', sentiment: 'NEGATIVE', anonymous: true, date: '2023-04-05', department: 'Engineering', message: 'The current sprint deadlines feel unrealistic and are leading to burnout.' },
        { id: 'F002', title: 'Positive team collaboration', status: 'REVIEWED', sentiment: 'POSITIVE', anonymous: false, date: '2023-04-04', department: 'Marketing', message: 'I really appreciate the collaborative spirit in our team this week.' },
        { id: 'F003', title: 'Suggestion for new software', status: 'NEW', sentiment: 'NEUTRAL', anonymous: true, date: '2023-04-03', department: 'IT', message: 'Could we consider implementing "Tool X" for better project management?' },
        { id: 'F004', title: 'Lack of clear communication', status: 'REVIEWED', sentiment: 'NEGATIVE', anonymous: true, date: '2023-04-02', department: 'Sales', message: 'Information flow from leadership has been inconsistent, causing confusion.' },
        { id: 'F005', title: 'Great mentorship program', status: 'ARCHIVED', sentiment: 'POSITIVE', anonymous: false, date: '2023-03-28', department: 'HR', message: 'My mentor has been incredibly helpful and supportive. Highly recommend.' },
        { id: 'F006', title: 'Office temperature too cold', status: 'NEW', sentiment: 'NEUTRAL', anonymous: true, date: '2023-04-01', department: 'Operations', message: 'The office AC is always set too low, it\'s quite uncomfortable.' },
        { id: 'F007', title: 'Appreciation for leadership transparency', status: 'NEW', sentiment: 'POSITIVE', anonymous: false, date: '2023-04-06', department: 'All', message: 'The recent all-hands meeting was very informative and transparent. Thank you!' },
    ],
    recognition: [
        { id: 'R001', recipient: 'Alice Johnson', giver: 'Bob Smith', status: 'APPROVED', message: 'For outstanding effort on the Q1 report!', date: '2023-04-01', department: 'Finance' },
        { id: 'R002', recipient: 'Charlie Brown', giver: 'David Lee', status: 'PENDING', message: 'For going above and beyond to help with the client presentation.', date: '2023-04-03', department: 'Sales' },
        { id: 'R003', recipient: 'Eve White', giver: 'Alice Johnson', status: 'APPROVED', message: 'Excellent problem-solving during the recent system outage.', date: '2023-03-28', department: 'IT' },
        { id: 'R004', recipient: 'Frank Green', giver: 'HR Admin', status: 'APPROVED', message: 'Celebrating 5 years of dedicated service!', date: '2023-04-05', department: 'HR' },
        { id: 'R005', recipient: 'Grace Hall', giver: 'Charlie Brown', status: 'PENDING', message: 'For consistently delivering high-quality code and supporting the team.', date: '2023-04-04', department: 'Engineering' },
        { id: 'R006', recipient: 'Heidi King', giver: 'Frank Green', status: 'APPROVED', message: 'Successfully coordinated the annual company picnic.', date: '2023-03-30', department: 'Operations' },
        { id: 'R007', recipient: 'Ivan Scott', giver: 'Eve White', status: 'PENDING', message: 'For always bringing a positive attitude and motivating the team.', date: '2023-04-06', department: 'Marketing' },
    ],
    actionPlans: [
        { id: 'A001', title: 'Improve Project X Communication', status: 'IN_PROGRESS', team: 'Engineering', manager: 'Manager B', dueDate: '2023-05-15', creationDate: '2023-02-01', description: 'Implement weekly sync meetings and a dedicated communication channel for Project X.' },
        { id: 'A002', title: 'Boost Sales Team Morale', status: 'DRAFT', team: 'Sales', manager: 'Manager C', dueDate: '2023-06-01', creationDate: '2023-03-10', description: 'Plan team-building events and introduce a peer recognition program within the sales department.' },
        { id: 'A003', title: 'Address Burnout Concerns', status: 'COMPLETED', team: 'All', manager: 'HR Admin', dueDate: '2023-03-31', creationDate: '2023-01-05', description: 'Conducted workshops on stress management and promoted flexible working hours.' },
        { id: 'A004', title: 'Enhance Onboarding Materials', status: 'IN_PROGRESS', team: 'HR', manager: 'HR Admin', dueDate: '2023-05-01', creationDate: '2023-03-20', description: 'Update and digitalize all new hire orientation documents and resources.' },
        { id: 'A005', title: 'Q2 Performance Review Prep', status: 'OVERDUE', team: 'Marketing', manager: 'Manager A', dueDate: '2023-04-01', creationDate: '2023-03-01', description: 'Prepare performance review documents and schedule one-on-one meetings with team members.' },
        { id: 'A006', title: 'Optimize IT Support Workflow', status: 'DRAFT', team: 'IT', manager: 'Manager E', dueDate: '2023-07-01', creationDate: '2023-04-02', description: 'Streamline ticket submission and resolution processes for internal IT support.' },
    ],
};

function App() {
    const [view, setView] = useState({ screen: 'DASHBOARD', params: {} });
    const [currentUserRole, setCurrentUserRole] = useState(ROLES.ADMIN.label); // Default user role for demonstration

    const navigate = (screen, params = {}) => {
        setView(prevView => ({
            ...prevView,
            screen,
            params,
        }));
    };

    const logout = () => {
        console.log("User logged out.");
        // In a real app, this would clear authentication tokens and redirect to login
        navigate('LOGIN'); // Assuming a login screen
    };

    const handleEdit = (entityType, id) => {
        console.log(`Editing ${entityType} with ID: ${id}`);
        // In a real app, this would navigate to an edit form
        alert(`Simulating edit for ${entityType} ID: ${id}`);
    };

    const handleDelete = (entityType, id) => {
        if (window.confirm(`Are you sure you want to delete ${entityType} with ID: ${id}?`)) {
            console.log(`Deleting ${entityType} with ID: ${id}`);
            // In a real app, this would trigger an API call and update state
            alert(`Simulating deletion for ${entityType} ID: ${id}`);
            // After deletion, navigate back to list or dashboard
            if (entityType === 'Survey') navigate('SURVEY_LIST');
            else if (entityType === 'Feedback') navigate('FEEDBACK_LIST');
            else if (entityType === 'Recognition') navigate('RECOGNITION_LIST');
            else if (entityType === 'ActionPlan') navigate('ACTIONPLAN_LIST');
        }
    };

    const handleBulkAction = (actionType) => {
        console.log(`Performing bulk action: ${actionType}`);
        alert(`Simulating bulk action: ${actionType}`);
    };

    const handleSearch = (query) => {
        console.log(`Searching for: ${query}`);
        alert(`Simulating search for: ${query}`);
    };

    const handleFilter = (filters) => {
        console.log('Applying filters:', filters);
        alert(`Simulating filter with: ${JSON.stringify(filters)}`);
    };

    const handleSort = (key, direction) => {
        console.log(`Sorting by ${key} in ${direction} direction`);
        alert(`Simulating sort by ${key}, direction: ${direction}`);
    };

    const handleSaveView = (viewName) => {
        console.log(`Saving current view as: ${viewName}`);
        alert(`Simulating saving view: ${viewName}`);
    };

    const handleFileUpload = (file) => {
        console.log('Uploading file:', file?.name);
        alert(`Simulating file upload for: ${file?.name}`);
    };

    const handleAuditLogView = (recordId) => {
        console.log(`Viewing audit logs for record: ${recordId}`);
        alert(`Simulating audit log view for record: ${recordId}`);
    };

    const generateBreadcrumbs = () => {
        const path = [];
        path.push({ label: 'Dashboard', screen: 'DASHBOARD' });

        switch (view.screen) {
            case 'SURVEY_LIST':
                path.push({ label: 'Surveys', screen: 'SURVEY_LIST' });
                break;
            case 'SURVEY_DETAIL':
                path.push({ label: 'Surveys', screen: 'SURVEY_LIST' });
                const survey = DUMMY_DATA.surveys.find(s => s.id === view.params?.id);
                if (survey) path.push({ label: survey.title, screen: 'SURVEY_DETAIL', params: view.params });
                break;
            case 'FEEDBACK_LIST':
                path.push({ label: 'Feedback', screen: 'FEEDBACK_LIST' });
                break;
            case 'FEEDBACK_DETAIL':
                path.push({ label: 'Feedback', screen: 'FEEDBACK_LIST' });
                const feedback = DUMMY_DATA.feedbacks.find(f => f.id === view.params?.id);
                if (feedback) path.push({ label: feedback.title, screen: 'FEEDBACK_DETAIL', params: view.params });
                break;
            case 'RECOGNITION_LIST':
                path.push({ label: 'Recognition', screen: 'RECOGNITION_LIST' });
                break;
            case 'RECOGNITION_DETAIL':
                path.push({ label: 'Recognition', screen: 'RECOGNITION_LIST' });
                const recognition = DUMMY_DATA.recognition.find(r => r.id === view.params?.id);
                if (recognition) path.push({ label: recognition.message?.substring(0, 20) + '...', screen: 'RECOGNITION_DETAIL', params: view.params });
                break;
            case 'ACTIONPLAN_LIST':
                path.push({ label: 'Action Plans', screen: 'ACTIONPLAN_LIST' });
                break;
            case 'ACTIONPLAN_DETAIL':
                path.push({ label: 'Action Plans', screen: 'ACTIONPLAN_LIST' });
                const actionPlan = DUMMY_DATA.actionPlans.find(ap => ap.id === view.params?.id);
                if (actionPlan) path.push({ label: actionPlan.title, screen: 'ACTIONPLAN_DETAIL', params: view.params });
                break;
            default:
                break;
        }
        return path;
    };

    const Breadcrumbs = ({ path }) => (
        <div className="breadcrumbs">
            {path.map((crumb, index) => (
                <span
                    key={crumb.label + index}
                    className={index === path.length - 1 ? 'current' : ''}
                    onClick={() => (index !== path.length - 1 ? navigate(crumb.screen, crumb.params) : null)}
                    style={{ cursor: index !== path.length - 1 ? 'pointer' : 'default' }}
                >
                    {crumb.label}
                </span>
            ))}
        </div>
    );

    const DashboardCard = ({ title, description, onClick }) => (
        <div className="card" onClick={onClick}>
            <h3 className="card-title">{title}</h3>
            <div className="card-content">
                <p>{description}</p>
            </div>
        </div>
    );

    const EntityCard = ({ id, title, status, details, onClick, role, entityType }) => {
        const statusInfo = STATUS_MAPPING[status] || { label: status, color: 'var(--color-text-secondary)' };
        const canEdit = ROLES[role]?.canEditAnyData || (role === ROLES.MANAGER.label && entityType !== 'Survey' && entityType !== 'ActionPlan' ? details?.manager === 'Manager B' : false); // Example field-level security
        const canDelete = ROLES[role]?.canEditAnyData;

        return (
            <div className="card" onClick={onClick} style={{ borderLeftColor: statusInfo.color }}>
                <h4 className="card-title">{title}</h4>
                <div className="card-content">
                    {Object.entries(details || {}).map(([key, value]) => (
                        <p key={key}><strong>{key}:</strong> {String(value)}</p>
                    ))}
                </div>
                <div className="card-footer">
                    <span className="status-badge" style={{ backgroundColor: statusInfo.color }}>
                        {statusInfo.label}
                    </span>
                    {(canEdit || canDelete) && (
                        <div className="card-actions" onClick={(e) => e.stopPropagation()}> {/* Prevent card click on button click */}
                            {canEdit && <button className="btn btn-ghost" onClick={() => handleEdit(entityType, id)}>Edit</button>}
                            {canDelete && <button className="btn btn-ghost" onClick={() => handleDelete(entityType, id)}>Delete</button>}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const ScreenComponents = {
        DASHBOARD: () => (
            <>
                <h2 className="screen-title live-pulse">PulsePoint Dashboard</h2>
                <div className="card-grid">
                    <DashboardCard
                        title="Surveys"
                        description="Manage and create employee pulse surveys."
                        onClick={() => navigate('SURVEY_LIST')}
                    />
                    <DashboardCard
                        title="Feedback"
                        description="Review anonymous and direct employee feedback."
                        onClick={() => navigate('FEEDBACK_LIST')}
                    />
                    <DashboardCard
                        title="Recognition"
                        description="Approve and view peer-to-peer recognitions."
                        onClick={() => navigate('RECOGNITION_LIST')}
                    />
                    <DashboardCard
                        title="Action Plans"
                        description="Track and implement plans based on feedback."
                        onClick={() => navigate('ACTIONPLAN_LIST')}
                    />
                    {ROLES[currentUserRole]?.canViewAllReports && (
                        <DashboardCard
                            title="Reports & Analytics"
                            description="Access high-level heatmaps, trends, and ROI dashboards."
                            onClick={() => alert('Navigating to Reports & Analytics (dummy)')}
                        />
                    )}
                </div>
            </>
        ),
        SURVEY_LIST: () => (
            <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <h2 className="screen-title" style={{ marginBottom: '0' }}>Surveys</h2>
                    {ROLES[currentUserRole]?.canCreateSurvey && (
                        <button className="btn btn-primary" onClick={() => alert('Navigating to Create New Survey Form (dummy)')}>
                            Create New Survey
                        </button>
                    )}
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                    <input
                        type="text"
                        placeholder="Search surveys..."
                        style={{ padding: 'var(--spacing-xs)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-border)', flexGrow: '1' }}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <button className="btn btn-ghost" onClick={() => handleFilter({ status: 'ACTIVE' })}>Filter</button>
                    <button className="btn btn-ghost" onClick={() => handleSort('startDate', 'desc')}>Sort</button>
                    {ROLES[currentUserRole]?.canPerformBulkActions && <button className="btn btn-secondary" onClick={() => handleBulkAction('Archive Surveys')}>Bulk Archive</button>}
                    <button className="btn btn-ghost" onClick={() => handleSaveView('My Active Surveys')}>Save View</button>
                </div>
                <div className="card-grid">
                    {DUMMY_DATA.surveys.map(survey => (
                        <EntityCard
                            key={survey.id}
                            id={survey.id}
                            title={survey.title}
                            status={survey.status}
                            details={{ Type: survey.type, Department: survey.department, 'Response Rate': survey.responseRate }}
                            onClick={() => navigate('SURVEY_DETAIL', { id: survey.id })}
                            role={currentUserRole}
                            entityType="Survey"
                        />
                    ))}
                </div>
            </>
        ),
        SURVEY_DETAIL: () => {
            const survey = DUMMY_DATA.surveys.find(s => s.id === view.params?.id);
            const statusInfo = STATUS_MAPPING[survey?.status] || { label: survey?.status, color: 'var(--color-text-secondary)' };
            const canEdit = ROLES[currentUserRole]?.canEditAnyData; // More granular would check creator/permissions

            if (!survey) return <p className="p-lg">Survey not found.</p>;

            return (
                <div className="detail-view">
                    <div className="detail-header">
                        <h3 className="detail-title">{survey.title}</h3>
                        <div className="detail-actions">
                            {canEdit && (
                                <>
                                    <button className="btn btn-primary" onClick={() => handleEdit('Survey', survey.id)}>Edit Survey</button>
                                    <button className="btn btn-ghost" onClick={() => handleDelete('Survey', survey.id)}>Delete Survey</button>
                                    <button className="btn btn-ghost" onClick={() => handleAuditLogView(survey.id)}>Audit Log</button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="detail-section">
                        <h4>General Information</h4>
                        <div className="detail-item">
                            <span className="detail-label">ID:</span>
                            <span className="detail-value">{survey.id}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Status:</span>
                            <span className="detail-value">
                                <span className="status-badge" style={{ backgroundColor: statusInfo.color }}>
                                    {statusInfo.label}
                                </span>
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Type:</span>
                            <span className="detail-value">{survey.type}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Department:</span>
                            <span className="detail-value">{survey.department}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Creator:</span>
                            <span className="detail-value">{survey.creator}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Description:</span>
                            <span className="detail-value">{survey.description}</span>
                        </div>
                    </div>

                    <div className="detail-section">
                        <h4>Timeline & Participation</h4>
                        <div className="detail-item">
                            <span className="detail-label">Start Date:</span>
                            <span className="detail-value">{survey.startDate}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">End Date:</span>
                            <span className="detail-value">{survey.endDate}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Response Rate:</span>
                            <span className="detail-value">{survey.responseRate}</span>
                        </div>
                        {/* Real-time charts would go here (e.g., placeholder for donut/bar chart) */}
                        <div className="detail-item mt-md">
                            <span className="detail-value" style={{ border: '1px dashed var(--color-border)', padding: 'var(--spacing-md)', display: 'block', textAlign: 'center', minHeight: '150px', backgroundColor: 'var(--color-background)' }}>
                                [Placeholder for Real-time Response Rate Chart (Donut/Bar)]
                            </span>
                        </div>
                    </div>
                </div>
            );
        },
        FEEDBACK_LIST: () => (
            <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <h2 className="screen-title" style={{ marginBottom: '0' }}>Employee Feedback</h2>
                    {ROLES[currentUserRole]?.canManageFeedback && (
                        <button className="btn btn-primary" onClick={() => alert('Navigating to Submit Feedback Form (dummy)')}>
                            Submit Feedback
                        </button>
                    )}
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                    <input
                        type="text"
                        placeholder="Search feedback..."
                        style={{ padding: 'var(--spacing-xs)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-border)', flexGrow: '1' }}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <button className="btn btn-ghost" onClick={() => handleFilter({ sentiment: 'NEGATIVE' })}>Filter</button>
                    <button className="btn btn-ghost" onClick={() => handleSort('date', 'desc')}>Sort</button>
                    {ROLES[currentUserRole]?.canPerformBulkActions && <button className="btn btn-secondary" onClick={() => handleBulkAction('Mark as Reviewed')}>Bulk Review</button>}
                </div>
                <div className="card-grid">
                    {DUMMY_DATA.feedbacks.map(feedback => (
                        <EntityCard
                            key={feedback.id}
                            id={feedback.id}
                            title={feedback.title}
                            status={feedback.status}
                            details={{ Sentiment: feedback.sentiment, Anonymous: feedback.anonymous ? 'Yes' : 'No', Date: feedback.date }}
                            onClick={() => navigate('FEEDBACK_DETAIL', { id: feedback.id })}
                            role={currentUserRole}
                            entityType="Feedback"
                        />
                    ))}
                </div>
            </>
        ),
        FEEDBACK_DETAIL: () => {
            const feedback = DUMMY_DATA.feedbacks.find(f => f.id === view.params?.id);
            const statusInfo = STATUS_MAPPING[feedback?.status] || { label: feedback?.status, color: 'var(--color-text-secondary)' };
            const sentimentInfo = STATUS_MAPPING[feedback?.sentiment] || { label: feedback?.sentiment, color: 'var(--color-text-secondary)' };
            const canEdit = ROLES[currentUserRole]?.canManageFeedback;

            if (!feedback) return <p className="p-lg">Feedback not found.</p>;

            return (
                <div className="detail-view">
                    <div className="detail-header">
                        <h3 className="detail-title">{feedback.title}</h3>
                        <div className="detail-actions">
                            {canEdit && (
                                <>
                                    <button className="btn btn-primary" onClick={() => handleEdit('Feedback', feedback.id)}>Mark as Reviewed</button>
                                    <button className="btn btn-ghost" onClick={() => handleDelete('Feedback', feedback.id)}>Archive</button>
                                    {ROLES[currentUserRole]?.canViewAuditLogs && <button className="btn btn-ghost" onClick={() => handleAuditLogView(feedback.id)}>Audit Log</button>}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="detail-section">
                        <h4>Feedback Details</h4>
                        <div className="detail-item">
                            <span className="detail-label">ID:</span>
                            <span className="detail-value">{feedback.id}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Status:</span>
                            <span className="detail-value">
                                <span className="status-badge" style={{ backgroundColor: statusInfo.color }}>
                                    {statusInfo.label}
                                </span>
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Sentiment:</span>
                            <span className="detail-value">
                                <span className="status-badge" style={{ backgroundColor: sentimentInfo.color }}>
                                    {sentimentInfo.label}
                                </span>
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Anonymous:</span>
                            <span className="detail-value">{feedback.anonymous ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Date:</span>
                            <span className="detail-value">{feedback.date}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Department:</span>
                            <span className="detail-value">{feedback.department}</span>
                        </div>
                        <div className="detail-item flex-column">
                            <span className="detail-label">Message:</span>
                            <p className="detail-value" style={{ marginTop: 'var(--spacing-xs)', padding: 'var(--spacing-sm)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--border-radius-sm)' }}>
                                {feedback.message}
                            </p>
                        </div>
                    </div>
                </div>
            );
        },
        RECOGNITION_LIST: () => (
            <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <h2 className="screen-title" style={{ marginBottom: '0' }}>Peer Recognition</h2>
                    {ROLES[currentUserRole]?.canManageRecognition && (
                        <button className="btn btn-primary" onClick={() => alert('Navigating to Give Recognition Form (dummy)')}>
                            Give Recognition
                        </button>
                    )}
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                    <input
                        type="text"
                        placeholder="Search recognition..."
                        style={{ padding: 'var(--spacing-xs)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-border)', flexGrow: '1' }}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <button className="btn btn-ghost" onClick={() => handleFilter({ status: 'PENDING' })}>Filter Pending</button>
                    <button className="btn btn-ghost" onClick={() => handleSort('date', 'desc')}>Sort</button>
                </div>
                <div className="card-grid">
                    {DUMMY_DATA.recognition.map(rec => (
                        <EntityCard
                            key={rec.id}
                            id={rec.id}
                            title={`To: ${rec.recipient}`}
                            status={rec.status}
                            details={{ From: rec.giver, Message: rec.message.substring(0, 50) + '...', Date: rec.date }}
                            onClick={() => navigate('RECOGNITION_DETAIL', { id: rec.id })}
                            role={currentUserRole}
                            entityType="Recognition"
                        />
                    ))}
                </div>
            </>
        ),
        RECOGNITION_DETAIL: () => {
            const recognition = DUMMY_DATA.recognition.find(r => r.id === view.params?.id);
            const statusInfo = STATUS_MAPPING[recognition?.status] || { label: recognition?.status, color: 'var(--color-text-secondary)' };
            const canApprove = (ROLES[currentUserRole]?.canManageRecognition && recognition?.status === 'PENDING');
            const canEdit = ROLES[currentUserRole]?.canEditAnyData;

            if (!recognition) return <p className="p-lg">Recognition not found.</p>;

            return (
                <div className="detail-view">
                    <div className="detail-header">
                        <h3 className="detail-title">Recognition for {recognition.recipient}</h3>
                        <div className="detail-actions">
                            {canApprove && (
                                <button className="btn btn-success" onClick={() => alert(`Approving Recognition ID: ${recognition.id}`)}>Approve</button>
                            )}
                            {canEdit && (
                                <>
                                    <button className="btn btn-primary" onClick={() => handleEdit('Recognition', recognition.id)}>Edit</button>
                                    <button className="btn btn-ghost" onClick={() => handleDelete('Recognition', recognition.id)}>Reject</button>
                                </>
                            )}
                            {ROLES[currentUserRole]?.canViewAuditLogs && <button className="btn btn-ghost" onClick={() => handleAuditLogView(recognition.id)}>Audit Log</button>}
                        </div>
                    </div>

                    <div className="detail-section">
                        <h4>Recognition Details</h4>
                        <div className="detail-item">
                            <span className="detail-label">ID:</span>
                            <span className="detail-value">{recognition.id}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Status:</span>
                            <span className="detail-value">
                                <span className="status-badge" style={{ backgroundColor: statusInfo.color }}>
                                    {statusInfo.label}
                                </span>
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Recipient:</span>
                            <span className="detail-value">{recognition.recipient}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Giver:</span>
                            <span className="detail-value">{recognition.giver}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Date:</span>
                            <span className="detail-value">{recognition.date}</span>
                        </div>
                        <div className="detail-item flex-column">
                            <span className="detail-label">Message:</span>
                            <p className="detail-value" style={{ marginTop: 'var(--spacing-xs)', padding: 'var(--spacing-sm)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--border-radius-sm)' }}>
                                {recognition.message}
                            </p>
                        </div>
                    </div>
                </div>
            );
        },
        ACTIONPLAN_LIST: () => (
            <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <h2 className="screen-title" style={{ marginBottom: '0' }}>Action Plans</h2>
                    {ROLES[currentUserRole]?.canCreateSurvey && ( // Assuming managers can create action plans based on surveys
                        <button className="btn btn-primary" onClick={() => alert('Navigating to Create Action Plan Form (dummy)')}>
                            Create New Plan
                        </button>
                    )}
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                    <input
                        type="text"
                        placeholder="Search action plans..."
                        style={{ padding: 'var(--spacing-xs)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-border)', flexGrow: '1' }}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <button className="btn btn-ghost" onClick={() => handleFilter({ status: 'OVERDUE' })}>Filter Overdue</button>
                    <button className="btn btn-ghost" onClick={() => handleSort('dueDate', 'asc')}>Sort</button>
                    {ROLES[currentUserRole]?.canPerformBulkActions && <button className="btn btn-secondary" onClick={() => handleBulkAction('Update Status')}>Bulk Update</button>}
                </div>
                <div className="card-grid">
                    {DUMMY_DATA.actionPlans.map(plan => (
                        <EntityCard
                            key={plan.id}
                            id={plan.id}
                            title={plan.title}
                            status={plan.status}
                            details={{ Team: plan.team, Manager: plan.manager, 'Due Date': plan.dueDate }}
                            onClick={() => navigate('ACTIONPLAN_DETAIL', { id: plan.id })}
                            role={currentUserRole}
                            entityType="ActionPlan"
                        />
                    ))}
                </div>
            </>
        ),
        ACTIONPLAN_DETAIL: () => {
            const plan = DUMMY_DATA.actionPlans.find(ap => ap.id === view.params?.id);
            const statusInfo = STATUS_MAPPING[plan?.status] || { label: plan?.status, color: 'var(--color-text-secondary)' };
            const canEdit = ROLES[currentUserRole]?.canEditAnyData;

            if (!plan) return <p className="p-lg">Action Plan not found.</p>;

            return (
                <div className="detail-view">
                    <div className="detail-header">
                        <h3 className="detail-title">{plan.title}</h3>
                        <div className="detail-actions">
                            {canEdit && (
                                <>
                                    <button className="btn btn-primary" onClick={() => handleEdit('ActionPlan', plan.id)}>Edit Plan</button>
                                    <button className="btn btn-ghost" onClick={() => handleDelete('ActionPlan', plan.id)}>Delete Plan</button>
                                </>
                            )}
                            {ROLES[currentUserRole]?.canViewAuditLogs && <button className="btn btn-ghost" onClick={() => handleAuditLogView(plan.id)}>Audit Log</button>}
                        </div>
                    </div>

                    <div className="detail-section">
                        <h4>Plan Overview</h4>
                        <div className="detail-item">
                            <span className="detail-label">ID:</span>
                            <span className="detail-value">{plan.id}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Status:</span>
                            <span className="detail-value">
                                <span className="status-badge" style={{ backgroundColor: statusInfo.color }}>
                                    {statusInfo.label}
                                </span>
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Team:</span>
                            <span className="detail-value">{plan.team}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Manager:</span>
                            <span className="detail-value">{plan.manager}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Due Date:</span>
                            <span className="detail-value">{plan.dueDate}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Creation Date:</span>
                            <span className="detail-value">{plan.creationDate}</span>
                        </div>
                        <div className="detail-item flex-column">
                            <span className="detail-label">Description:</span>
                            <p className="detail-value" style={{ marginTop: 'var(--spacing-xs)', padding: 'var(--spacing-sm)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--border-radius-sm)' }}>
                                {plan.description}
                            </p>
                        </div>
                        {/* Placeholder for workflow tracker or milestone tracking */}
                        <div className="detail-item mt-md">
                            <span className="detail-value" style={{ border: '1px dashed var(--color-border)', padding: 'var(--spacing-md)', display: 'block', textAlign: 'center', minHeight: '100px', backgroundColor: 'var(--color-background)' }}>
                                [Placeholder for Visual Workflow Tracker / Milestone Tracking]
                            </span>
                        </div>
                    </div>
                </div>
            );
        },
    };

    const CurrentScreenComponent = ScreenComponents[view.screen];
    const breadcrumbs = generateBreadcrumbs();

    return (
        <div className="app-container">
            <header className="header">
                <div className="header-left">
                    <h1>PulsePoint</h1>
                    <Breadcrumbs path={breadcrumbs} />
                </div>
                <div className="header-right">
                    <div className="user-info">
                        <span>Logged in as: <strong>{currentUserRole}</strong></span>
                        <select
                            value={currentUserRole}
                            onChange={(e) => setCurrentUserRole(e.target.value)}
                            style={{ padding: 'var(--spacing-xxs)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-border)', marginRight: 'var(--spacing-sm)' }}
                        >
                            {Object.values(ROLES).map(role => (
                                <option key={role.label} value={role.label}>{role.label}</option>
                            ))}
                        </select>
                    </div>
                    <button className="btn btn-ghost" onClick={logout}>Logout</button>
                </div>
            </header>
            <main className="main-content">
                {CurrentScreenComponent ? <CurrentScreenComponent /> : <p className="text-center p-lg">Screen Not Found!</p>}
            </main>
        </div>
    );
}

export default App;