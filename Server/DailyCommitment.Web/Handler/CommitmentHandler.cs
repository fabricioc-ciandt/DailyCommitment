using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;

namespace DailyCommitment.Web.Handler
{
    public class CommitmentHandler
    {
        private const string FILE_NAME = @"C:\Commitments.xml";

        public void SaveCommitment(Commitment commitment)
        {
            // Save to XML
            var f = openCommitmentsFile();

            // Identify which member to modify
            var node = f.Descendants("Team")
                        .Where(t => t.Attribute("name").Value == commitment.Team)
                        .Descendants("Member")
                        .Single(e => e.Attribute("Assignee").Value == commitment.Assignee);

            // modify specific zone combination
            node.Element("Date").Value = commitment.Date;
            node.Element("Story").Value = commitment.Story;
            node.Element("Task").Value = commitment.Task;
            node.Element("Description").Value = commitment.Description;
            node.Element("Commitment").Value = commitment.CommitmentAim;
            node.Element("Status").Value = commitment.Status;

            f.Save(FILE_NAME, SaveOptions.None);
        }

        public IEnumerable<Commitment> GetAllCommitments(string team)
        {
            //Read XML
            var f = openCommitmentsFile();

            var commitments = from c in f.Descendants("Team")
                                         .Where(x => x.Attribute("name").Value == team)
                                         .Descendants("Member")
                              select new Commitment
                              {
                                  Team = team,
                                  Assignee = c.Attribute("Assignee").Value,
                                  Date = c.Descendants("Date").First().Value,
                                  Story = c.Descendants("Story").First().Value,
                                  Task = c.Descendants("Task").First().Value,
                                  Description = c.Descendants("Description").First().Value,
                                  CommitmentAim = c.Descendants("Commitment").First().Value,
                                  Status = c.Descendants("Status").First().Value,
                              };

            return commitments;
        }

        private XDocument openCommitmentsFile()
        {
            var comFile = XDocument.Load(FILE_NAME, LoadOptions.None);
            return comFile;
        }
    }
}