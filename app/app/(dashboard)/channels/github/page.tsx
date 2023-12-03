export default function GithubChannel({ params }: { params: { id: string } }) {
    return (
      <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="font-cal text-3xl font-bold dark:text-white">
              Channels: Github
            </h1>
            
          </div>
        </div>
      </div>
    );
  }