using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(DailyCommitment.Web.Startup))]

namespace DailyCommitment.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
