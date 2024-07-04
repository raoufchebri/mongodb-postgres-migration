"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClusterProvisioning;
const icons_1 = require("@/components/icons");
const react_1 = require("react");
function ClusterProvisioning() {
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)('');
    const onClick = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const res = await fetch('/api/seed');
        if (res.ok) {
            window.location.reload();
            setIsSubmitting(false);
            setError('');
        }
        else {
            const json = await res.json();
            setError(json.error.message);
            setIsSubmitting(false);
        }
    };
    return (<div className="h-screen w-screen flex flex-col justify-center items-center bg-gradient-to-l from-pink-300 via-purple-300 to-indigo-400">
      <div className="rounded-[14px] bg-[#111111] p-4 text-white w-[26rem]">
        <h1 className="text-lg font-bold text-center">Almost ready!</h1>
        <p className="mt-2 text-sm">
          It looks like your Database Cluster on MongoDB Atlas is not
          provisioned yet. Database could not be seeded during first deployment.
        </p>
        <button type="button" onClick={onClick} className="mt-4 text-white text-[13px] font-mono bg-black border border-[#333333] hover:border-white transition-all rounded-md w-full h-[40px] flex items-center justify-center whitespace-nowrap" disabled={isSubmitting}>
          {isSubmitting ? <icons_1.LoadingDots color="white"/> : 'Seed Database'}
        </button>

        <div className="text-center">
          <a href="https://cloud.mongodb.com/" target="_blank" rel="noreferrer" className="font-mono text-xs text-gray-400 hover:text-white hover:underline transition-all">
            Check cluster status
          </a>
        </div>

        {error && (<div className="mt-4 text-red-500 text-sm flex items-center space-x-1">
            <icons_1.AlertCircleIcon className="w-4 h-4"/>
            <p>
              <span className="font-bold">Error: </span>
              {error}
            </p>
          </div>)}
      </div>
    </div>);
}
