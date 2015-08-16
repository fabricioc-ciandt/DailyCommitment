using DailyCommitment.Web.Handler;
using System;
using System.Web.Mvc;

namespace DailyCommitment.Web.Controllers
{
    public class DailyCommitmentController : Controller
    {
        [HttpGet]
        public JsonResult Get(string team)
        {
            var commitmentHandler = new CommitmentHandler();
            var commitments = commitmentHandler.GetAllCommitments(team);
            return Json(commitments, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Save(string team, string assignee, string date, string story, string task, string description, string commitment, string status)
        {
            try
            {
                var commitmentHandler = new CommitmentHandler();

                var c = new Commitment
                {
                    Team = team,
                    Assignee = assignee,
                    Date = date,
                    Story = story,
                    Task = task,
                    Description = description,
                    CommitmentAim = commitment,
                    Status = status,
                };

                commitmentHandler.SaveCommitment(c);

                return Json("Success", JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                return Json("Error", JsonRequestBehavior.AllowGet);
            }
        }
    }
}