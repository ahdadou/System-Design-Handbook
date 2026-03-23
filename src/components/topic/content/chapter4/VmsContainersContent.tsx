"use client";
import { KeyTakeaway } from "@/components/ui/KeyTakeaway";
import { QuizBlock } from "@/components/ui/QuizBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";
import { SystemNode } from "@/components/diagrams/CustomNodes";
import { Node, Edge } from "@xyflow/react";

const nodeTypes = { system: SystemNode };

const nodes: Node[] = [
  // VM side
  { id: "hw1", type: "system", position: { x: 0, y: 0 }, data: { label: "Physical Server", sublabel: "VM model", icon: "🖥️", color: "#3b82f6", description: "Same physical hardware underneath. VMs and containers both ultimately run on CPUs, RAM, and storage." } },
  { id: "hypervisor", type: "system", position: { x: 0, y: 120 }, data: { label: "Hypervisor", sublabel: "VMware / KVM / Hyper-V", icon: "⚡", color: "#3b82f6", description: "Type 1 (bare-metal): runs directly on hardware (VMware ESXi, KVM). Type 2 (hosted): runs on OS (VirtualBox, VMware Workstation). Emulates hardware for each VM." } },
  { id: "vm1", type: "system", position: { x: 0, y: 260 }, data: { label: "VM 1", sublabel: "Guest OS + App", icon: "💻", color: "#8b5cf6", description: "Full OS (e.g., Ubuntu 22.04) + app. 1-2 GB RAM overhead just for OS. Boots in 30-60 seconds. Complete isolation  own kernel, network stack, filesystem." } },
  { id: "vm2", type: "system", position: { x: 200, y: 260 }, data: { label: "VM 2", sublabel: "Guest OS + App", icon: "💻", color: "#8b5cf6", description: "Each VM has its own OS kernel. Can run Windows VM on Linux hypervisor. Strong security isolation  kernel exploits in one VM can't affect another." } },
  // Container side
  { id: "hw2", type: "system", position: { x: 300, y: 0 }, data: { label: "Physical Server", sublabel: "Container model", icon: "🖥️", color: "#10b981", description: "Same physical hardware. Host OS kernel is shared by all containers  this is the key difference from VMs." } },
  { id: "runtime", type: "system", position: { x: 300, y: 120 }, data: { label: "Container Runtime", sublabel: "Docker / containerd", icon: "🐳", color: "#06b6d4", description: "Uses Linux namespaces (process, network, filesystem isolation) and cgroups (CPU/memory limits). No hardware emulation  just OS-level isolation." } },
  { id: "c1", type: "system", position: { x: 200, y: 260 }, data: { label: "Container 1", sublabel: "App only", icon: "📦", color: "#10b981", description: "Just the app + its dependencies. Shares host kernel. Starts in <1 second. 10-100 MB overhead vs 1-2 GB for VM. Perfect for microservices." } },
  { id: "c2", type: "system", position: { x: 360, y: 260 }, data: { label: "Container 2", sublabel: "App only", icon: "📦", color: "#10b981", description: "Shares same Linux kernel as other containers. Container escape vulnerabilities are rare but do exist. For untrusted workloads, use gVisor or Kata Containers for stronger isolation." } },
  { id: "c3", type: "system", position: { x: 480, y: 260 }, data: { label: "Container 3", sublabel: "App only", icon: "📦", color: "#10b981", description: "More containers fit on same hardware vs VMs  typically 10-20x density improvement. This is why containers transformed cloud economics." } },
];

const edges: Edge[] = [
  { id: "e1", source: "hw1", target: "hypervisor", animated: true, style: { stroke: "#3b82f6", strokeWidth: 2 } },
  { id: "e2", source: "hypervisor", target: "vm1", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 2 } },
  { id: "e3", source: "hypervisor", target: "vm2", animated: true, style: { stroke: "#8b5cf6", strokeWidth: 2 } },
  { id: "e4", source: "hw2", target: "runtime", animated: true, style: { stroke: "#10b981", strokeWidth: 2 } },
  { id: "e5", source: "runtime", target: "c1", animated: true, style: { stroke: "#06b6d4", strokeWidth: 2 } },
  { id: "e6", source: "runtime", target: "c2", animated: true, style: { stroke: "#06b6d4", strokeWidth: 2 } },
  { id: "e7", source: "runtime", target: "c3", animated: true, style: { stroke: "#06b6d4", strokeWidth: 2 } },
];

const questions = [
  {
    question: "Why do containers start up much faster than virtual machines?",
    options: [
      "Containers use faster CPUs",
      "Containers share the host OS kernel and use namespace isolation  there is no OS to boot, just the application process",
      "Containers are smaller in file size",
      "Virtual machines must connect to the network before starting",
    ],
    correct: 1,
    explanation: "VMs must boot an entire guest OS (BIOS/UEFI → kernel → init system → services) which takes 30-60 seconds. Containers use Linux namespaces and cgroups  the host kernel is already running. Starting a container is just forking a new process in an isolated namespace, which takes milliseconds.",
  },
  {
    question: "When would you choose a VM over a container?",
    options: [
      "When you need fast horizontal scaling",
      "When running untrusted multi-tenant workloads requiring strong kernel-level isolation, or when running different OS types on the same hardware",
      "When you want to reduce infrastructure costs",
      "When deploying microservices to Kubernetes",
    ],
    correct: 1,
    explanation: "VMs provide stronger isolation because each has its own kernel. Use VMs for: multi-tenant cloud (AWS EC2), running Windows apps on Linux hosts, workloads where a container escape would be catastrophic, or legacy apps that require full OS environments. Containers are better for microservices, CI/CD, and high-density deployments.",
  },
  {
    question: "What Linux kernel features do containers use to achieve process isolation?",
    options: [
      "Hypervisor traps and hardware virtualization extensions (VT-x/AMD-V)",
      "Namespaces (for resource isolation) and cgroups (for resource limits)",
      "SELinux mandatory access control policies",
      "POSIX capabilities and file permission ACLs",
    ],
    correct: 1,
    explanation: "Containers use Linux namespaces to isolate resources (pid, network, mount, uts, ipc, user namespaces) so each container sees its own isolated view. cgroups (control groups) limit resource consumption (CPU, memory, I/O). Together these provide process-level isolation without a separate kernel.",
  },
  {
    question: "What is the purpose of a Union Filesystem (like OverlayFS) in Docker?",
    options: [
      "To merge multiple network interfaces into a single virtual interface",
      "To create layered, copy-on-write image layers so base layers are shared between containers while each container has its own writable layer",
      "To synchronize files across multiple containers in real time",
      "To encrypt container filesystem data at rest",
    ],
    correct: 1,
    explanation: "Docker images consist of read-only layers (base OS, dependencies, app code) stacked using OverlayFS. Multiple containers can share the same read-only layers, saving disk space and pull time. Each running container gets a thin writable layer on top. Writes are copy-on-write, so the shared layers are never modified.",
  },
  {
    question: "What is the difference between a Type 1 and Type 2 hypervisor?",
    options: [
      "Type 1 runs on top of a host OS; Type 2 runs directly on hardware",
      "Type 1 (bare-metal) runs directly on hardware (e.g., VMware ESXi, KVM); Type 2 (hosted) runs as an application on a host OS (e.g., VirtualBox)",
      "Type 1 supports Linux VMs only; Type 2 supports all operating systems",
      "Type 1 uses software emulation; Type 2 uses hardware virtualization",
    ],
    correct: 1,
    explanation: "Type 1 hypervisors run directly on the physical hardware, acting as the OS themselves (VMware ESXi, KVM, Hyper-V on Windows Server). Type 2 hypervisors run as applications on top of an existing host OS (VirtualBox, VMware Workstation). Type 1 is used in production data centers; Type 2 is common for development.",
  },
  {
    question: "In Kubernetes, what is a Pod?",
    options: [
      "A virtual machine that runs on a Kubernetes node",
      "The smallest deployable unit in Kubernetes, consisting of one or more containers that share network and storage",
      "A namespace for grouping related Kubernetes deployments",
      "A load balancer that distributes traffic across container replicas",
    ],
    correct: 1,
    explanation: "A Pod is the smallest deployable unit in Kubernetes. It wraps one or more containers that share the same network namespace (same IP, same localhost) and can share volumes. Containers in a pod are always co-scheduled on the same node. Typically, one container per pod is the standard pattern.",
  },
  {
    question: "What is a container escape vulnerability, and which technology provides stronger protection against it?",
    options: [
      "A vulnerability where container images can contain malware; solved by image scanning tools",
      "A vulnerability where a process inside a container exploits kernel bugs to gain host-level access; gVisor or Kata Containers provide stronger isolation",
      "A networking vulnerability where containers on different hosts can communicate without authorization",
      "A storage vulnerability where containers can read other containers' volumes",
    ],
    correct: 1,
    explanation: "Container escape occurs when malicious code inside a container exploits a Linux kernel vulnerability to break out of namespace isolation and gain access to the host or other containers. gVisor (Google) interposes system calls in user space, and Kata Containers run containers in lightweight VMs, both providing stronger isolation for untrusted workloads.",
  },
  {
    question: "How many more containers can typically be packed onto a host compared to VMs with equivalent workloads?",
    options: [
      "About 2-3x more containers than VMs",
      "Roughly the same density since CPU is the limiting factor",
      "Typically 10-20x more containers than VMs due to reduced memory overhead",
      "Containers cannot run on the same host as VMs",
    ],
    correct: 2,
    explanation: "Each VM requires 1-2 GB of RAM just for the guest OS kernel and system processes. Containers add only 10-100 MB overhead each. On a 64 GB host, you might run 30-40 VMs versus 500-1000 containers. This density improvement is why containers transformed cloud economics and enabled microservices architectures.",
  },
  {
    question: "What is the relationship between Docker and Kubernetes in a production system?",
    options: [
      "Docker and Kubernetes serve identical functions; you choose one or the other",
      "Docker is a container runtime that builds and runs containers; Kubernetes is an orchestrator that decides where and how many containers run across a cluster",
      "Kubernetes replaced Docker; Docker is no longer used in production",
      "Kubernetes runs on top of Docker and requires Docker as its container runtime",
    ],
    correct: 1,
    explanation: "Docker handles building container images and running individual containers (via containerd runtime). Kubernetes is an orchestration layer that manages containers at scale: scheduling, auto-scaling, rolling deployments, health checks, and service discovery across a cluster of nodes. Kubernetes today uses containerd directly (not Docker daemon) but Docker-built images are fully compatible.",
  },
  {
    question: "What problem does a Kubernetes Horizontal Pod Autoscaler (HPA) solve?",
    options: [
      "It automatically updates container images to the latest version",
      "It automatically scales the number of pod replicas up or down based on CPU, memory, or custom metrics to match demand",
      "It balances network traffic across pods using a round-robin algorithm",
      "It horizontally partitions the Kubernetes etcd cluster for scalability",
    ],
    correct: 1,
    explanation: "HPA watches a target metric (e.g., average CPU utilization) and automatically adjusts the replica count of a Deployment. When load increases, HPA scales up pod count; when load decreases, it scales down to save resources. This eliminates manual intervention for traffic spikes and is the primary horizontal scaling mechanism in Kubernetes.",
  },
];

export default function VmsContainersContent({ slug }: { slug: string; chapterId: number }) {
  return (
    <div className="space-y-6 text-txt-2">
      <p className="text-base leading-relaxed">
        <strong className="text-txt">Virtual Machines (VMs)</strong> emulate an entire computer  CPU, memory, storage, network  through a hypervisor. <strong className="text-txt">Containers</strong> package just the application and its dependencies, sharing the host OS kernel through Linux namespaces and cgroups. Both technologies solve the same problem  running multiple isolated workloads on shared hardware  but with radically different approaches and trade-offs.
      </p>
      <p>
        The shift from VMs to containers fundamentally changed how software is deployed. Docker (2013) made containers accessible; Kubernetes (2014) made them orchestratable at scale. Understanding both remains essential  most production environments use VMs (EC2 instances) running containers (pods) simultaneously.
      </p>

      <InteractiveDiagram
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        title="Virtual Machines vs Containers"
        description="Left: VMs with Hypervisor and Guest OS per VM. Right: Containers sharing host OS kernel. Click nodes for details."
        height={360}
      />

      <h2 className="text-2xl font-bold font-heading text-txt">Side-by-Side Comparison</h2>
      <div className="space-y-2">
        {[
          { aspect: "Startup Time", vm: "30-60 seconds (OS boot)", container: "Milliseconds to seconds", winner: "container", color: "#10b981" },
          { aspect: "Isolation Level", vm: "Full kernel isolation  own OS, network, filesystem", container: "Process-level  shared kernel, namespace isolation", winner: "vm", color: "#8b5cf6" },
          { aspect: "Memory Overhead", vm: "1-2 GB per VM (OS alone)", container: "10-100 MB (app + minimal libs)", winner: "container", color: "#10b981" },
          { aspect: "Instance Density", vm: "~10s per physical host", container: "100s-1000s per physical host", winner: "container", color: "#10b981" },
          { aspect: "Security Boundary", vm: "Hypervisor  extremely hard to escape", container: "Kernel namespace  container escapes are possible", winner: "vm", color: "#8b5cf6" },
          { aspect: "Portability", vm: "Heavy image files (GBs), slow to move", container: "Layered OCI images, fast pull from registry", winner: "container", color: "#10b981" },
          { aspect: "OS Flexibility", vm: "Any OS (Linux, Windows, BSD) on same hypervisor", container: "Must match host kernel type (Linux on Linux, etc)", winner: "vm", color: "#8b5cf6" },
          { aspect: "Provisioning", vm: "Minutes (cloud API)", container: "Seconds (scheduler places immediately)", winner: "container", color: "#10b981" },
        ].map((row) => (
          <div key={row.aspect} className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-surface border border-border-ui text-xs">
            <div className="font-semibold text-txt font-heading">{row.aspect}</div>
            <div className={`text-txt-2 ${row.winner === "vm" ? "font-semibold" : ""}`} style={row.winner === "vm" ? { color: row.color } : {}}>
              {row.winner === "vm" && "★ "}{row.vm}
            </div>
            <div className={`text-txt-2 ${row.winner === "container" ? "font-semibold" : ""}`} style={row.winner === "container" ? { color: row.color } : {}}>
              {row.winner === "container" && "★ "}{row.container}
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold font-heading text-txt">How Containers Work Under the Hood</h2>
      <div className="space-y-3">
        {[
          { feature: "Linux Namespaces", color: "#06b6d4", desc: "Containers use 6 namespaces to create isolation: pid (process IDs), net (network interfaces), mnt (filesystem mounts), uts (hostname), ipc (inter-process communication), user (user IDs). Each container sees its own isolated view of these resources." },
          { feature: "cgroups (Control Groups)", color: "#3b82f6", desc: "Linux kernel feature that limits, accounts for, and isolates resource usage (CPU, memory, disk I/O, network). Docker --memory=512m and --cpus=1.5 use cgroups under the hood. Without cgroups, one container could starve all others." },
          { feature: "Union Filesystems", color: "#8b5cf6", desc: "Docker images are layered using overlay filesystems (OverlayFS). Base layers are shared between containers (e.g., Ubuntu base layer). Only the writable container layer is unique per instance. This is why pulling a 500MB image reuses cached layers  fast and storage-efficient." },
        ].map((item) => (
          <div key={item.feature} className="flex gap-3 p-4 rounded-xl bg-surface border border-border-ui">
            <div className="w-1 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <div>
              <div className="font-semibold text-sm text-txt font-heading mb-1">{item.feature}</div>
              <p className="text-xs text-txt-2 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="info">
        Docker is a container runtime; Kubernetes is an orchestrator. Kubernetes decides where containers run, handles restarts, scaling, rolling deployments, and service discovery across a cluster of nodes. The Kubernetes control plane itself runs in VMs (or bare metal). In production: VMs provide the infrastructure, containers provide the workload isolation.
      </KeyTakeaway>

      <h2 className="text-2xl font-bold font-heading text-txt">Container Orchestration with Kubernetes</h2>
      <p>
        Running containers in production at scale requires an orchestrator. Kubernetes abstracts away individual machines  you declare desired state (3 replicas of my-service) and K8s makes it happen.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {[
          { concept: "Pod", icon: "📦", color: "#3b82f6", desc: "Smallest unit in K8s. One or more containers sharing network and storage. Usually 1 container per pod." },
          { concept: "Deployment", icon: "🚀", color: "#06b6d4", desc: "Manages replica sets. Handles rolling updates, rollbacks. Ensures N replicas always running." },
          { concept: "Service", icon: "⚖️", color: "#8b5cf6", desc: "Stable network endpoint for a set of pods. Load balances traffic. Pods come/go; Service IP is stable." },
          { concept: "Horizontal Pod Autoscaler", icon: "📈", color: "#10b981", desc: "Automatically scales pod count based on CPU/memory/custom metrics. Ties into cloud auto-scaling." },
        ].map((item) => (
          <div key={item.concept} className="p-3 rounded-xl border bg-surface" style={{ borderColor: `${item.color}40` }}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl">{item.icon}</span>
              <div className="font-bold text-xs text-txt font-heading" style={{ color: item.color }}>{item.concept}</div>
            </div>
            <p className="text-[10px] text-txt-2 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <KeyTakeaway variant="tip">
        For system design interviews: use containers (Kubernetes) for stateless services that need fast scaling and high density. Use VMs for stateful workloads (databases running outside K8s), legacy applications, and multi-tenant isolation. In practice, your K8s nodes are EC2 VMs  it's layers all the way down.
      </KeyTakeaway>

      <QuizBlock topicSlug={slug} questions={questions} />
    </div>
  );
}
