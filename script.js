
// Research Faculty Dataset
const faculty = [
    {
        id: 1,
        name: "Dr. Arun Kumar",
        department: "Computer Science",
        interests: ["Artificial Intelligence", "Machine Learning", "Data Science"],
        expertise: ["Python", "Deep Learning"],
        publications: 12,
        projects: ["AI Healthcare System"]
    },
    {
        id: 2,
        name: "Dr. Priya Sharma",
        department: "Information Technology",
        interests: ["Artificial Intelligence", "Data Science", "Cloud Computing"],
        expertise: ["Python", "Big Data"],
        publications: 10,
        projects: ["Smart Healthcare"]
    },
    {
        id: 3,
        name: "Dr. Ravi Kumar",
        department: "Electronics",
        interests: ["Internet of Things", "Machine Learning", "Robotics"],
        expertise: ["Embedded Systems", "Python"],
        publications: 8,
        projects: ["Smart Agriculture"]
    },
    {
        id: 4,
        name: "Dr. Meena Devi",
        department: "Computer Science",
        interests: ["Cyber Security", "Cloud Computing", "Data Science"],
        expertise: ["Network Security", "Cloud"],
        publications: 15,
        projects: ["Secure Cloud Platform"]
    },
    {
        id: 5,
        name: "Dr. Karthik Raj",
        department: "Information Technology",
        interests: ["Machine Learning", "Artificial Intelligence", "Robotics"],
        expertise: ["Python", "Neural Networks"],
        publications: 9,
        projects: ["Autonomous Robot"]
    }
];

// Dashboard Statistics
function updateDashboard() {
    document.getElementById("facultyCount").textContent = faculty.length;

    document.getElementById("publicationCount").textContent =
        faculty.reduce((sum, f) => sum + f.publications, 0);

    document.getElementById("projectCount").textContent =
        faculty.reduce((sum, f) => sum + f.projects.length, 0);

    document.getElementById("matchCount").textContent =
        getRecommendations().length;
}

// Display Faculty Members
function displayFaculty(data) {
    const container = document.getElementById("facultyList");
    container.innerHTML = "";

    if (data.length === 0) {
        container.innerHTML = "<p>No faculty members found.</p>";
        return;
    }

    data.forEach(person => {
        container.innerHTML += `
            <div class="faculty-card">
                <h3>${person.name}</h3>
                <p><b>Department:</b> ${person.department}</p>
                <p><b>Publications:</b> ${person.publications}</p>
                <p><b>Research Interests:</b></p>

                ${person.interests.map(item =>
                    `<span class="tag">${item}</span>`
                ).join("")}

                <p><b>Expertise:</b></p>

                ${person.expertise.map(item =>
                    `<span class="tag">${item}</span>`
                ).join("")}

                <p><b>Projects:</b> ${person.projects.join(", ")}</p>
            </div>
        `;
    });
}

// Search Faculty
document.getElementById("searchInput").addEventListener("input", function() {
    const value = this.value.toLowerCase();

    const filtered = faculty.filter(person =>
        person.name.toLowerCase().includes(value) ||
        person.department.toLowerCase().includes(value) ||
        person.interests.some(item =>
            item.toLowerCase().includes(value)
        ) ||
        person.expertise.some(item =>
            item.toLowerCase().includes(value)
        )
    );

    displayFaculty(filtered);
});

// Calculate Collaboration Score
function calculateMatch(person1, person2) {

    const commonInterests = person1.interests.filter(item =>
        person2.interests.includes(item)
    );

    const commonExpertise = person1.expertise.filter(item =>
        person2.expertise.includes(item)
    );

    const commonProjects = person1.projects.filter(item =>
        person2.projects.includes(item)
    );

    const total =
        commonInterests.length * 20 +
        commonExpertise.length * 10 +
        commonProjects.length * 10;

    return {
        score: Math.min(total, 100),
        interests: commonInterests,
        expertise: commonExpertise,
        projects: commonProjects
    };
}

// Find Collaboration Opportunities
function getRecommendations() {
    const results = [];

    for (let i = 0; i < faculty.length; i++) {
        for (let j = i + 1; j < faculty.length; j++) {

            const match = calculateMatch(faculty[i], faculty[j]);

            if (match.score > 0) {
                results.push({
                    first: faculty[i],
                    second: faculty[j],
                    ...match
                });
            }
        }
    }

    return results.sort((a, b) => b.score - a.score);
}

// Display Recommendations
function displayRecommendations() {
    const container = document.getElementById("recommendations");
    const recommendations = getRecommendations();

    container.innerHTML = "";

    recommendations.forEach(item => {
        container.innerHTML += `
            <div class="recommendation-card">
                <h3>${item.first.name} + ${item.second.name}</h3>

                <p><b>Departments:</b>
                ${item.first.department} & ${item.second.department}</p>

                <p><b>Common Research Interests:</b>
                ${item.interests.join(", ") || "None"}</p>

                <p><b>Common Expertise:</b>
                ${item.expertise.join(", ") || "None"}</p>

                <p><b>Common Projects:</b>
                ${item.projects.join(", ") || "None"}</p>

                <p class="match">
                    Collaboration Match: ${item.score}%
                </p>
            </div>
        `;
    });
}

// Create Knowledge Graph
function createKnowledgeGraph() {

    const nodes = [];
    const edges = [];
    const addedTopics = new Set();
    const addedProjects = new Set();

    faculty.forEach(person => {

        // Faculty Node
        nodes.push({
            id: "F" + person.id,
            label: person.name,
            group: "faculty",
            shape: "dot",
            size: 25,
            title: person.department
        });

        // Research Interest Nodes
        person.interests.forEach(topic => {

            const topicId = "T" + topic;

            if (!addedTopics.has(topic)) {
                nodes.push({
                    id: topicId,
                    label: topic,
                    group: "topic",
                    shape: "diamond",
                    size: 18
                });

                addedTopics.add(topic);
            }

            edges.push({
                from: "F" + person.id,
                to: topicId,
                label: "Research"
            });
        });

        // Project Nodes
        person.projects.forEach(project => {

            const projectId = "P" + project;

            if (!addedProjects.has(project)) {
                nodes.push({
                    id: projectId,
                    label: project,
                    group: "project",
                    shape: "box",
                    size: 15
                });

                addedProjects.add(project);
            }

            edges.push({
                from: "F" + person.id,
                to: projectId,
                label: "Works on"
            });
        });
    });

    const graphData = {
        nodes: new vis.DataSet(nodes),
        edges: new vis.DataSet(edges)
    };

    const options = {
        nodes: {
            font: {
                size: 14,
                color: "#26364f"
            },
            borderWidth: 2
        },

        groups: {
            faculty: {
                color: "#42a5f5"
            },
            topic: {
                color: "#a78bfa"
            },
            project: {
                color: "#34d399"
            }
        },

        edges: {
            color: "#9aa9bd",
            font: {
                size: 10,
                align: "middle"
            },
            smooth: true
        },

        physics: {
            stabilization: true,
            barnesHut: {
                gravitationalConstant: -3000
            }
        },

        interaction: {
            hover: true,
            navigationButtons: true,
            keyboard: true
        }
    };

    const network = new vis.Network(
        document.getElementById("network"),
        graphData,
        options
    );
}

// Start Application
updateDashboard();
displayFaculty(faculty);
displayRecommendations();
createKnowledgeGraph();
