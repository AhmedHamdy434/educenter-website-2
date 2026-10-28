import { GroupDetailsHeader } from "./group-details/GroupDetailsHeader";
import { EnrolledStudentsList } from "./group-details/EnrolledStudentsList";
import { AttendanceTab } from "./group-details/AttendanceTab";
import { AttendanceReportsTab } from "./group-details/AttendanceReportsTab";
import { GroupPaymentsTab } from "./group-details/GroupPaymentsTab";
import GroupDetailsTabs from "./group-details/GroupDetailsTabs";
import { getGroupTab } from "../config/group-tabs";

interface GroupDetailsClientProps {
  isOwner: boolean;
  groupId: string;
  tab?: string;
}

export function GroupDetailsClient({
  isOwner,
  groupId,
  tab = "students",
}: GroupDetailsClientProps) {
  const activeTab = getGroupTab(tab);

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <GroupDetailsHeader
        groupId={groupId}
        showAddButton={isOwner && activeTab === "students"}
      />

      <div className="space-y-6">
        <GroupDetailsTabs />

        {/* Active Tab Content */}
        <div className="min-h-100">
          {activeTab === "students" && (
            <EnrolledStudentsList
              groupId={groupId}
              showRemoveButton={isOwner}
            />
          )}

          {activeTab === "attendance" && <AttendanceTab groupId={groupId} />}

          {activeTab === "reports" && (
            <AttendanceReportsTab groupId={groupId} />
          )}

          {activeTab === "payments" && <GroupPaymentsTab groupId={groupId} />}
        </div>
      </div>
    </div>
  );
}
