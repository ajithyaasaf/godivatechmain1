import { Helmet } from "react-helmet";
import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AdminLayout from "@/components/admin/AdminLayout";
import ContentDataTable from "@/components/admin/ContentDataTable";
import TeamMemberForm from "@/components/admin/TeamMemberForm";

const TeamMembersPage = () => {
  // Define columns for the team members data table
  const columns = [
    {
      key: "name",
      title: "Name",
      render: (value: string, item: any) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={item.image || undefined} alt={value} />
            <AvatarFallback>
              {value.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="font-medium">{value}</div>
        </div>
      ),
    },
    {
      key: "position",
      title: "Position",
    },
    {
      key: "bio",
      title: "Bio",
      render: (value: string) => (
        <div className="truncate max-w-[300px]">{value}</div>
      ),
    },
    {
      key: "linkedIn",
      title: "LinkedIn",
      render: (value: string) => (
        value ? (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary underline hover:text-primary/80"
          >
            Profile
          </a>
        ) : (
          <span className="text-muted-foreground">Not set</span>
        )
      ),
    },
  ];

  return (
    <AdminLayout>
      <Helmet>
        <title>Manage Team Members | GodivaTech Admin</title>
      </Helmet>
      
      <ContentDataTable
        title="Team Members"
        endpoint="/team-members"
        columns={columns}
        renderForm={(teamMember, onSave, onCancel) => (
          <TeamMemberForm teamMember={teamMember} onSave={onSave} onCancel={onCancel} />
        )}
      />
    </AdminLayout>
  );
};

export default TeamMembersPage;