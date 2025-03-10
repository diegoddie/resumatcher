import JobPostCardItem from "@/components/Dashboard/JobPostCardItem";

function page() {
    const item = [
        {
            id: "1",
            role: "Software Engineer",
            company: "Google",
            location: "Milan",
            description: "We are looking for a software engineer with 3 years of experience in React and Node.js.",
            matchScore: 95,
            requirements: ["React", "Node.js", "Typescript"],
            salary: "35.000€ - 45.000€",
            url: "https://www.google.com"
        },
        {
            id: "2",
            role: "Full Stack Developer",
            company: "Facebook",
            location: "Brescia",
            description: "We are looking for a full stack developer with 3 years of experience in React and Node.js.",
            matchScore: 65,
            requirements: ["PHP", "Laravel", "Docker"],
            url: "https://www.facebook.com"
        },
        {
            id: "3",
            role: "Backend Developer",
            company: "Amazon",
            location: "Rome",
            description: "We are looking for a backend developer with 3 years of experience in Python and Django.",
            matchScore: 80,
            requirements: ["Python", "Django", "PostgreSQL"],
            salary: "40.000€ - 50.000€",
            url: "https://www.amazon.com",
          },
          {
            id: "4",
            role: "Data Scientist",
            company: "Microsoft",
            location: "Turin",
            description: "We are looking for a data scientist with expertise in machine learning and data analysis.",
            matchScore: 88,
            requirements: ["Python", "TensorFlow", "SQL"],
            salary: "45.000€ - 55.000€",
            url: "https://www.microsoft.com",
          },
          {
            id: "5",
            role: "Frontend Engineer",
            company: "Spotify",
            location: "Bologna",
            description: "We are looking for a frontend engineer specialized in React and UI/UX design.",
            matchScore: 72,
            requirements: ["React", "Next.js", "Figma"],
            salary: "30.000€ - 40.000€",
            url: "https://www.spotify.com",
          },
          {
            id: "6",
            role: "Cloud Engineer",
            company: "IBM",
            location: "Florence",
            description: "We are looking for a cloud engineer with experience in AWS and Kubernetes.",
            matchScore: 78,
            requirements: ["AWS", "Kubernetes", "Terraform"],
            salary: "50.000€ - 60.000€",
            url: "https://www.ibm.com",
          },
    ]
    
  return (
    <div className="p-5 md:p-9">
      <div className="flex flex-col space-y-7 md:space-y-9">
        <div className="flex flex-col space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Job Report
          </h1>
          <p className="text-muted-foreground">
            View your job reports and analytics.
          </p>
        </div>
        {item.map((item, index) => (
            <JobPostCardItem key={item.id} item={item} isBlurred={index >= 2} />
        ))}
    </div>
    </div>
  );
}

export default page;
