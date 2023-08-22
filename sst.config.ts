import { SSTConfig } from 'sst'
import { LambdaUtils } from './stacks/LambdaUtils'

export default {
	config(_input) {
		return {
			name: 'lambda-utils',
			region: 'us-east-1'
		}
	},
	stacks(app) {
		app.stack(LambdaUtils)
	}
} satisfies SSTConfig
