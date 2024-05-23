import RepoService from "@/app/services/RepoService";
import DependentPackages from "@/components/packages/dependent-packages";


export default async function PackagesPage() {

	const res = await RepoService.getRepos()
	const repos = res.map(repo => ({
		radarId: repo.radarId,
		name: repo.name
	}));
	
	return (
		<DependentPackages repos={repos} />
	)
}