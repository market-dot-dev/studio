import React from "react";
import CheckoutComponent from "./checkout-component";
import TierService from "@/app/services/TierService";
import ContractService from "@/app/services/contract-service";
import Tier from "@/app/models/Tier";
import UserService from "@/app/services/UserService";
import FeatureService from "@/app/services/feature-service";

export default async function CheckoutPage({ params}: { params: { id: string } }) {

	const tier = await TierService.findTier(params.id) as Tier;
	
	const [contract, maintainer, hasActiveFeatures, features] = await Promise.all([
		tier?.contractId ? ContractService.getContractById(tier?.contractId) : null,
		UserService.findUser(tier?.userId),
		FeatureService.hasActiveFeaturesForUser(tier?.userId),
		FeatureService.findByTierId(tier?.id)
	]);

	return (
		<>
		{ (tier && maintainer) ?
			<CheckoutComponent 
				id={params.id} 
				tier={tier} 
				contract={contract} 
				maintainer={maintainer} 
				hasActiveFeatures={hasActiveFeatures} 
				features={features}   />
			: <div>Not found</div>
		}
		</>
	)
}