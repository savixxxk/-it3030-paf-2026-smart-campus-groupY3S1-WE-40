import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const COLORS = {
	slate900: [15, 23, 42],
	slate800: [30, 41, 59],
	slate700: [51, 65, 85],
	slate500: [100, 116, 139],
	slate300: [203, 213, 225],
	cyan500: [6, 182, 212],
	cyan700: [14, 116, 144],
	emerald500: [16, 185, 129],
	rose500: [244, 63, 94],
	amber500: [245, 158, 11],
	white: [255, 255, 255]
};

function formatDateTime(value) {
	if (!value) {
		return "--";
	}

	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime()) ? "--" : date.toLocaleString();
}

function formatDateOnly(value) {
	if (!value) {
		return "--";
	}

	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime()) ? "--" : date.toLocaleDateString();
}

function createPdfDocument() {
	return new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
}

function drawHeaderFooter(doc, title, subtitle, generatedAt, pageNumber) {
	const pageWidth = doc.internal.pageSize.getWidth();
	const pageHeight = doc.internal.pageSize.getHeight();
	const margin = 14;

	doc.setFillColor(...COLORS.slate900);
	doc.rect(0, 0, pageWidth, 28, "F");
	doc.setFillColor(...COLORS.cyan500);
	doc.rect(0, 28, pageWidth, 1.4, "F");

	doc.setTextColor(...COLORS.white);
	doc.setFont("helvetica", "bold");
	doc.setFontSize(18);
	doc.text(title, margin, 12);

	doc.setFont("helvetica", "normal");
	doc.setFontSize(9);
	doc.setTextColor(203, 213, 225);
	doc.text(subtitle, margin, 18);

	doc.setFontSize(8);
	doc.text(`Generated ${generatedAt}`, pageWidth - margin, 12, { align: "right" });
	doc.text("Smart Campus Admin Dashboard", pageWidth - margin, 18, { align: "right" });

	doc.setDrawColor(...COLORS.slate300);
	doc.setLineWidth(0.2);
	doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

	doc.setFontSize(8);
	doc.setTextColor(...COLORS.slate500);
	doc.text("Smart Campus", margin, pageHeight - 8);
	doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 8, { align: "center" });
	doc.text("https://smart-campus.local", pageWidth - margin, pageHeight - 8, { align: "right" });
}

function drawSummaryCard(doc, { x, y, w, h, label, value, detail, accent }) {
	doc.setFillColor(248, 250, 252);
	doc.setDrawColor(...COLORS.slate300);
	doc.roundedRect(x, y, w, h, 3, 3, "FD");
	doc.setFillColor(...accent);
	doc.roundedRect(x, y, 4, h, 3, 3, "F");

	doc.setTextColor(...COLORS.slate700);
	doc.setFont("helvetica", "bold");
	doc.setFontSize(9);
	doc.text(label, x + 8, y + 8);

	doc.setTextColor(...COLORS.slate900);
	doc.setFontSize(18);
	doc.text(String(value), x + 8, y + 16);

	doc.setTextColor(...COLORS.slate500);
	doc.setFont("helvetica", "normal");
	doc.setFontSize(8);
	doc.text(detail, x + 8, y + h - 4);
}

function getSummaryCardLayout(doc, count) {
	const pageWidth = doc.internal.pageSize.getWidth();
	const margin = 14;
	const gap = 6;
	const columns = count > 2 ? 2 : 1;
	const cardWidth = (pageWidth - margin * 2 - gap * (columns - 1)) / columns;
	return { cardWidth, gap, columns };
}

function addSectionIntro(doc, title, description, startY) {
	doc.setTextColor(...COLORS.slate900);
	doc.setFont("helvetica", "bold");
	doc.setFontSize(13);
	doc.text(title, 14, startY);

	doc.setFont("helvetica", "normal");
	doc.setFontSize(9);
	doc.setTextColor(...COLORS.slate500);
	doc.text(description, 14, startY + 5);

	return startY + 9;
}

function addFilterLine(doc, label, value, y) {
	doc.setFillColor(236, 254, 255);
	doc.setDrawColor(...COLORS.cyan500);
	doc.roundedRect(14, y, doc.internal.pageSize.getWidth() - 28, 10, 2, 2, "FD");
	doc.setFont("helvetica", "bold");
	doc.setFontSize(8);
	doc.setTextColor(...COLORS.cyan700);
	doc.text(`${label}:`, 18, y + 6.5);
	doc.setFont("helvetica", "normal");
	doc.setTextColor(...COLORS.slate700);
	doc.text(value, 42, y + 6.5);
	return y + 14;
}

export function downloadUsersReportPdf(users, filters = {}) {
	const doc = createPdfDocument();
	const generatedAt = new Date().toLocaleString();
	const activeUsers = users.filter((user) => !user.blocked).length;
	const blockedUsers = users.filter((user) => user.blocked).length;
	const adminUsers = users.filter((user) => String(user.role).toUpperCase() === "ADMIN").length;
	const uniqueRoles = new Set(users.map((user) => user.role).filter(Boolean)).size;
	const tableRows = users.map((user) => [
		user.name,
		user.email,
		user.role,
		formatDateOnly(user.createdAt),
		user.blocked ? "Blocked" : "Active"
	]);

	doc.setProperties({
		title: "Smart Campus Users Report",
		subject: "Admin user management report",
		author: "Smart Campus",
		creator: "Smart Campus Admin Dashboard"
	});

	doc.setFillColor(248, 250, 252);
	doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), "F");

	doc.setDrawColor(...COLORS.slate300);
	doc.setFillColor(255, 255, 255);
	doc.roundedRect(14, 38, doc.internal.pageSize.getWidth() - 28, 16, 3, 3, "FD");
	doc.setFont("helvetica", "bold");
	doc.setFontSize(12);
	doc.setTextColor(...COLORS.slate900);
	doc.text("Report Summary", 18, 46);

	const filtersText = [
		filters.search ? `Search ${filters.search}` : "Search all users",
		filters.roleFilter && filters.roleFilter !== "ALL" ? `Role ${filters.roleFilter}` : "All roles"
	].join(" • ");

	doc.setFont("helvetica", "normal");
	doc.setFontSize(9);
	doc.setTextColor(...COLORS.slate500);
	doc.text(filtersText, 18, 52);

	const { cardWidth, gap } = getSummaryCardLayout(doc, 4);
	drawSummaryCard(doc, { x: 14, y: 60, w: cardWidth, h: 22, label: "Total Users", value: users.length, detail: "Live accounts in the current view", accent: COLORS.cyan500 });
	drawSummaryCard(doc, { x: 14 + cardWidth + gap, y: 60, w: cardWidth, h: 22, label: "Active", value: activeUsers, detail: "Users available for access", accent: COLORS.emerald500 });
	drawSummaryCard(doc, { x: 14, y: 86, w: cardWidth, h: 22, label: "Blocked", value: blockedUsers, detail: "Accounts currently blocked", accent: COLORS.rose500 });
	drawSummaryCard(doc, { x: 14 + cardWidth + gap, y: 86, w: cardWidth, h: 22, label: "Admin Roles", value: adminUsers, detail: `${uniqueRoles} role type${uniqueRoles === 1 ? "" : "s"} in report`, accent: COLORS.amber500 });

	const tableStartY = addSectionIntro(doc, "User Directory", "User details aligned to the admin dashboard data and current filters.", 118);
	autoTable(doc, {
		startY: addFilterLine(doc, "Applied filters", filtersText, tableStartY),
		head: [["Name", "Email", "Role", "Joined", "Status"]],
		body: tableRows,
		margin: { left: 14, right: 14, bottom: 18 },
		styles: {
			font: "helvetica",
			fontSize: 8.5,
			cellPadding: 2.6,
			textColor: COLORS.slate900,
			lineColor: COLORS.slate300,
			lineWidth: 0.2
		},
		headStyles: {
			fillColor: COLORS.slate900,
			textColor: COLORS.white,
			fontStyle: "bold"
		},
		alternateRowStyles: {
			fillColor: [245, 250, 252]
		},
		columnStyles: {
			0: { cellWidth: 58 },
			1: { cellWidth: 72 },
			2: { cellWidth: 28 },
			3: { cellWidth: 32 },
			4: { cellWidth: 24 }
		},
		didDrawPage: (data) => {
			drawHeaderFooter(doc, "Users Report", "Smart Campus admin user export", generatedAt, data.pageNumber);
		}
	});

	doc.save("smart-campus-users-report.pdf");
}

export function downloadNotificationsReportPdf(notifications) {
	const doc = createPdfDocument();
	const generatedAt = new Date().toLocaleString();
	const highPriority = notifications.filter((item) => String(item.priority).toUpperCase() === "HIGH").length;
	const mediumPriority = notifications.filter((item) => String(item.priority).toUpperCase() === "MEDIUM").length;
	const lowPriority = notifications.filter((item) => String(item.priority).toUpperCase() === "LOW").length;
	const uniqueCategories = new Set(notifications.map((item) => item.category).filter(Boolean)).size;
	const recentCount = notifications.filter((item) => {
		if (!item.createdAt) {
			return false;
		}

		const postedAt = new Date(item.createdAt);
		if (Number.isNaN(postedAt.getTime())) {
			return false;
		}

		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
		return postedAt >= sevenDaysAgo;
	}).length;
	const tableRows = notifications.map((item) => [
		item.title,
		item.category,
		item.priority || "Medium",
		formatDateTime(item.createdAt),
		item.message
	]);

	doc.setProperties({
		title: "Smart Campus Notifications Report",
		subject: "Admin notifications report",
		author: "Smart Campus",
		creator: "Smart Campus Admin Dashboard"
	});

	doc.setFillColor(248, 250, 252);
	doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), "F");

	doc.setDrawColor(...COLORS.slate300);
	doc.setFillColor(255, 255, 255);
	doc.roundedRect(14, 38, doc.internal.pageSize.getWidth() - 28, 16, 3, 3, "FD");
	doc.setFont("helvetica", "bold");
	doc.setFontSize(12);
	doc.setTextColor(...COLORS.slate900);
	doc.text("Report Summary", 18, 46);

	doc.setFont("helvetica", "normal");
	doc.setFontSize(9);
	doc.setTextColor(...COLORS.slate500);
	doc.text("All published notices from the admin notification feed.", 18, 52);

	const { cardWidth, gap } = getSummaryCardLayout(doc, 4);
	drawSummaryCard(doc, { x: 14, y: 60, w: cardWidth, h: 22, label: "Total Notices", value: notifications.length, detail: "Published notices in this export", accent: COLORS.cyan500 });
	drawSummaryCard(doc, { x: 14 + cardWidth + gap, y: 60, w: cardWidth, h: 22, label: "High Priority", value: highPriority, detail: "Urgent messages highlighted", accent: COLORS.rose500 });
	drawSummaryCard(doc, { x: 14, y: 86, w: cardWidth, h: 22, label: "Categories", value: uniqueCategories, detail: "Unique notice groups", accent: COLORS.amber500 });
	drawSummaryCard(doc, { x: 14 + cardWidth + gap, y: 86, w: cardWidth, h: 22, label: "Recent (7 days)", value: recentCount, detail: "Fresh announcements", accent: COLORS.emerald500 });

	const introY = addSectionIntro(doc, "Published Notices", "Each notice uses a compact, website-friendly layout with the Smart Campus color palette.", 118);
	autoTable(doc, {
		startY: addFilterLine(doc, "Priority breakdown", `High ${highPriority} • Medium ${mediumPriority} • Low ${lowPriority}`, introY),
		head: [["Title", "Category", "Priority", "Posted At", "Message"]],
		body: tableRows,
		margin: { left: 14, right: 14, bottom: 18 },
		styles: {
			font: "helvetica",
			fontSize: 8.2,
			cellPadding: 2.4,
			textColor: COLORS.slate900,
			lineColor: COLORS.slate300,
			lineWidth: 0.2,
			valign: "top"
		},
		headStyles: {
			fillColor: COLORS.slate900,
			textColor: COLORS.white,
			fontStyle: "bold"
		},
		alternateRowStyles: {
			fillColor: [245, 250, 252]
		},
		columnStyles: {
			0: { cellWidth: 46 },
			1: { cellWidth: 42 },
			2: { cellWidth: 24 },
			3: { cellWidth: 38 },
			4: { cellWidth: 95 }
		},
		didDrawPage: (data) => {
			drawHeaderFooter(doc, "Notifications Report", "Smart Campus admin notification export", generatedAt, data.pageNumber);
		}
	});

	doc.save("smart-campus-notifications-report.pdf");
}