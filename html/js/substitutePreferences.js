var Substitutes = {
			index: window.localStorage.getItem("Substitutes:index"),
			$table: document.getElementById("Substitutes-table"),
			$form: document.getElementById("Substitutes-form"),
			$button_save: document.getElementById("Substitutes-op-save"),
			$button_discard: document.getElementById("Substitutes-op-discard"),

			init: function() {
				// initialize storage index
				if (!Substitutes.index) {
					window.localStorage.setItem("Substitutes:index", Substitutes.index = 1);
				}

				// initialize form
				Substitutes.$form.reset();
				Substitutes.$button_discard.addEventListener("click", function(event) {
					Substitutes.$form.reset();
					Substitutes.$form.sub_id_entry.value = 0;
				}, true);
				Substitutes.$form.addEventListener("submit", function(event) {
					var entry = {
						id: parseInt(this.sub_id_entry.value),
						sub_name: this.sub_name.value,
						sub_PIN: this.sub_PIN.value,
						sub_SSN: this.sub_SSN.value,
						sub_phone: this.sub_phone.value,
						sub_rating: this.sub_rating.value,
						sub_seniority: this.sub_seniority.value,
						sub_acceptSubject: this.sub_acceptSubject.value,
						sub_prefSubject: this.sub_prefSubject.value,
						sub_acceptGradeLevel: this.sub_acceptGradeLevel.value,
						sub_prefGradeLevel: this.sub_prefGradeLevel.value,
						sub_school: this.sub_school.value,
						sub_teachersSubstituted: this.sub_teachersSubstituted.value
						
					};
					if (entry.id == 0) { // add
						Substitutes.storeAdd(entry);
						Substitutes.tableAdd(entry);
					}
					else { // edit
						Substitutes.storeEdit(entry);
						Substitutes.tableEdit(entry);
					}

					this.reset();
					this.sub_id_entry.value = 0;
					event.preventDefault();
				}, true);

				// initialize table
				if (window.localStorage.length - 1) {
					var Substitutes_list = [], i, key;
					for (i = 0; i < window.localStorage.length; i++) {
						key = window.localStorage.key(i);
						if (/Substitutes:\d+/.test(key)) {
							Substitutes_list.push(JSON.parse(window.localStorage.getItem(key)));
						}
					}

					if (Substitutes_list.length) {
						Substitutes_list
							.sort(function(a, b) {
								return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
							})
							.forEach(Substitutes.tableAdd);
					}
				}
				Substitutes.$table.addEventListener("click", function(event) {
					var op = event.target.getAttribute("data-op");
					if (/edit|remove/.test(op)) {
						var entry = JSON.parse(window.localStorage.getItem("Substitutes:"+ event.target.getAttribute("data-id")));
						if (op == "edit") {
							Substitutes.$form.sub_id_entry.value = entry.id;
							Substitutes.$form.sub_name.value = entry.sub_name;
							Substitutes.$form.sub_SSN.value = entry.sub_SSN;
							Substitutes.$form.sub_PIN.value = entry.sub_PIN;
							Substitutes.$form.sub_phone.value = entry.sub_phone;
							Substitutes.$form.sub_rating.value = entry.sub_rating;
							Substitutes.$form.sub_seniority.value = entry.sub_seniority;
							Substitutes.$form.sub_acceptSubject.value = entry.sub_acceptSubject;
							Substitutes.$form.sub_prefSubject.value = entry.sub_prefSubject;
							Substitutes.$form.sub_acceptGradeLevel.value = entry.sub_acceptGradeLevel;
							Substitutes.$form.sub_prefGradeLevel.value = entry.sub_prefGradeLevel;
							Substitutes.$form.sub_school.value = entry.sub_school;
							Substitutes.$form.sub_teachersSubstituted.value = entry.sub_teachersSubstituted;
						}
						else if (op == "remove") {
							if (confirm('Are you sure you want to remove "'+ entry.sub_name +' '+ entry.sub_SSN +'" from your Substitutes?')) {
								Substitutes.storeRemove(entry);
								Substitutes.tableRemove(entry);
							}
						}
						event.preventDefault();
					}
				}, true);
			},

			storeAdd: function(entry) {
				entry.id = Substitutes.index;
				window.localStorage.setItem("Substitutes:index", ++Substitutes.index);
				window.localStorage.setItem("Substitutes:"+ entry.id, JSON.stringify(entry));
			},
			storeEdit: function(entry) {
				window.localStorage.setItem("Substitutes:"+ entry.id, JSON.stringify(entry));
			},
			storeRemove: function(entry) {
				window.localStorage.removeItem("Substitutes:"+ entry.id);
			},

			tableAdd: function(entry) {
				var $tr = document.createElement("tr"), $td, key;
				for (key in entry) {
					if (entry.hasOwnProperty(key)) {
						$td = document.createElement("td");
						$td.appendChild(document.createTextNode(entry[key]));
						$tr.appendChild($td);
					}
				}
				$td = document.createElement("td");
				$td.innerHTML = '<a data-op="edit" data-id="'+ entry.id +'">Edit</a> | <a data-op="remove" data-id="'+ entry.id +'">Remove</a>';
				$tr.appendChild($td);
				$tr.setAttribute("id", "sub-entry-"+ entry.id);
				Substitutes.$table.appendChild($tr);
			},
			tableEdit: function(entry) {
				var $tr = document.getElementById("sub-entry-"+ entry.id), $td, key;
				$tr.innerHTML = "";
				for (key in entry) {
					if (entry.hasOwnProperty(key)) {
						$td = document.createElement("td");
						$td.appendChild(document.createTextNode(entry[key]));
						$tr.appendChild($td);
					}
				}
				$td = document.createElement("td");
				$td.innerHTML = '<a data-op="edit" data-id="'+ entry.id +'">Edit</a> | <a data-op="remove" data-id="'+ entry.id +'">Remove</a>';
				$tr.appendChild($td);
			},
			tableRemove: function(entry) {
				Substitutes.$table.removeChild(document.getElementById("sub-entry-"+ entry.id));
			}
		};
		Substitutes.init();